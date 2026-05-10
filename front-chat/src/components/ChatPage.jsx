import React, { useState, useRef, useEffect } from "react";
import { MdAttachFile, MdSend, MdLogout } from "react-icons/md";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";
import SockJS from "sockjs-client";
import { baseURL } from "../config/AxiosHelper";
import toast from "react-hot-toast";
import { Stomp } from "@stomp/stompjs";
import { getMessages } from "../services/RoomService";
import { timeAgo } from "../config/helper";
import { uploadFile } from "../services/UploadService";

const ChatPage = () => {
    const navigate = useNavigate();
    const {roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser} = useChatContext();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);
    const fileInputRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (!connected) {
            navigate("/");
        }
    }, [connected, roomId, currentUser, navigate]);

    useEffect(() => {
        async function loadMessages() {
            try {
                const allMessages = await getMessages(roomId);
                setMessages(allMessages);
            } catch (error) {
                console.error("Error loading messages:", error);
            }
        }
        if (connected) {
            loadMessages();
        }
    }, [connected, roomId]);

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        const connectWebSocket = () => {
            const sock = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(sock);

            client.connect({}, () => {
                setStompClient(client);
                toast.success("Connected to Roomy Chat!");
                client.subscribe(`/topic/room/${roomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                });
            });
        };
        if (connected) {
            connectWebSocket();
        }
    }, [roomId, connected]);

    const sendMessage = async () => {
        if (stompClient && connected && input.trim()) {
            const message = {
                sender: currentUser,
                content: input,
                roomId: roomId,
                messageType: "TEXT",
            };
            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            setInput("");
        }
    };

    const handleFileButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setIsUploading(true);
            const uploaded = await uploadFile(file);
            const isImage = (uploaded.contentType || "").startsWith("image/");
            const isPdf = uploaded.contentType === "application/pdf";
            const message = {
                sender: currentUser,
                content: isImage ? "Image" : isPdf ? "PDF" : "File",
                roomId: roomId,
                messageType: isImage ? "IMAGE" : isPdf ? "PDF" : "FILE",
                attachment: uploaded,
            };
            stompClient?.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            toast.success("Attachment sent");
        } catch (err) {
            console.error(err);
            toast.error("Upload failed");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    function handleLogOut() {
        if (stompClient !== null) {
            stompClient.disconnect();
        }
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate("/");
    }

    const renderMessageContent = (message) => {
        if (message.messageType === "IMAGE" && message.attachment?.url) {
            return (
                <div className="mt-2">
                    <img src={message.attachment.url} alt={message.attachment.fileName} className="max-w-xs rounded" />
                </div>
            );
        }
        if ((message.messageType === "PDF" || message.messageType === "FILE") && message.attachment?.url) {
            return (
                <div className="mt-2">
                    <a
                        href={message.attachment.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-200 underline break-all"
                    >
                        {message.attachment.fileName || "Download"}
                    </a>
                </div>
            );
        }
    return <p className="chat-message-text">{message.content}</p>;
    };

    return (
        <div className="chat-page flex flex-col h-screen relative">
            <header className="retro-header chat-header">
                <div className="chat-shell flex flex-col lg:flex-row lg:justify-between lg:items-center gap-3">
                    <div>
                        <h1 className="chat-title font-bold">Roomy Chat</h1>
                        <p className="chat-kicker">Room {roomId}</p>
                    </div>
                    <div className="chat-meta flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                        <span className="chat-pill">User <strong>{currentUser}</strong></span>
                        <button 
                            onClick={handleLogOut} 
                            className="chat-leave-btn rounded-full"
                        >
                            <MdLogout size={18} />
                            Leave
                        </button>
                    </div>
                </div>
            </header>

            <main ref={chatBoxRef} className="chat-window flex-grow overflow-auto retro-chat-window rounded-[22px]">
                {messages.map((message, index) => (
                    <div key={index} className={`chat-row flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`chat-bubble ${message.sender === currentUser ? 'chat-bubble-self' : 'chat-bubble-other'} rounded-2xl`}> 
                            <div className="flex items-start gap-3">
                                <img 
                                    className="chat-avatar rounded-full border-2 border-white/15 shadow-lg"
                                    src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${message.sender}`} 
                                    alt={`${message.sender}'s avatar`}
                                />
                                <div>
                                    <p className="chat-sender font-semibold">{message.sender}</p>
                                    {renderMessageContent(message)}
                                    <p className="chat-time mt-2">{timeAgo(message.timeStamp)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <div className="chat-composer rounded-[24px]">
                <div className="chat-shell flex flex-col md:flex-row items-center gap-3">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                sendMessage();
                            }
                        }}
                        placeholder="Type your message here..." 
                        className="chat-input flex-grow rounded-full focus:outline-none"
                    />

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={handleFileChange}
                    />

                    <button
                        onClick={handleFileButtonClick}
                        disabled={isUploading}
                        title={isUploading ? "Uploading..." : "Attach file"}
                        className={`chat-icon-btn chat-attach-btn rounded-full ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MdAttachFile size={22} />
                    </button>

                    <button 
                        onClick={sendMessage}
                        className="chat-icon-btn chat-send-btn rounded-full"
                    >
                        <MdSend size={22} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
