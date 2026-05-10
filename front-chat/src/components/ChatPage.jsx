import React, { useState, useRef, useEffect } from "react";
import { MdAttachFile, MdSend } from "react-icons/md";
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
        return <p className="text-white mt-1">{message.content}</p>;
    };

    return (
        <div className="flex flex-col h-screen relative">
            <header className="retro-header p-4">
                <div className="container mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <h1 className="text-2xl font-bold retro-title">Roomy Chat</h1>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 gap-2 text-sm retro-subtitle">
                        <span>Room: <span className="font-semibold text-white">{roomId}</span></span>
                        <span>User: <span className="font-semibold text-white">{currentUser}</span></span>
                        <button 
                            onClick={handleLogOut} 
                            className="retro-btn retro-btn-danger px-4 py-2 rounded-full"
                        >
                            Leave Room
                        </button>
                    </div>
                </div>
            </header>

            <main ref={chatBoxRef} className="flex-grow overflow-auto p-6 space-y-4 retro-chat-window mx-4 mt-6 rounded-[28px]">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg retro-message ${message.sender === currentUser ? 'retro-message-self' : 'retro-message-other'} rounded-3xl p-4`}> 
                            <div className="flex items-start gap-3">
                                <img 
                                    className="h-10 w-10 rounded-full border-2 border-white/15 shadow-lg"
                                    src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${message.sender}`} 
                                    alt={`${message.sender}'s avatar`}
                                />
                                <div>
                                    <p className="font-semibold text-white">{message.sender}</p>
                                    {renderMessageContent(message)}
                                    <p className="text-xs text-gray-300 mt-2">{timeAgo(message.timeStamp)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <div className="p-4 mx-4 mt-4 retro-card rounded-full border border-white/10">
                <div className="container mx-auto flex flex-col md:flex-row items-center gap-3">
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
                        className="flex-grow retro-input rounded-full px-4 py-3 focus:outline-none"
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
                        className={`retro-btn retro-btn-secondary rounded-full p-3 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <MdAttachFile size={24} />
                    </button>

                    <button 
                        onClick={sendMessage}
                        className="retro-btn retro-btn-primary rounded-full p-3"
                    >
                        <MdSend size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;