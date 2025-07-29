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

const ChatPage = () => {
    const navigate = useNavigate();
    const {roomId, currentUser, connected, setConnected, setRoomId, setCurrentUser} = useChatContext();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);

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
                roomId: roomId
            };
            stompClient.send(`/app/sendMessage/${roomId}`, {}, JSON.stringify(message));
            setInput("");
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

    return (
        <div className="flex flex-col h-screen bg-gradient-to-r from-gray-700 to-gray-900">
            <header className="bg-gray-800 shadow-md p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Roomy Chat</h1>
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-300">Room: <span className="font-semibold">{roomId}</span></span>
                        <span className="text-gray-300">User: <span className="font-semibold">{currentUser}</span></span>
                        <button 
                            onClick={handleLogOut} 
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full transition duration-300 ease-in-out"
                        >
                            Leave Room
                        </button>
                    </div>
                </div>
            </header>

            <main ref={chatBoxRef} className="flex-grow overflow-auto p-6 space-y-4">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${message.sender === currentUser ? 'bg-blue-500' : 'bg-gray-600'} rounded-lg p-3 shadow-md`}>
                            <div className="flex items-start space-x-3">
                                <img 
                                    className="h-10 w-10 rounded-full" 
                                    src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${message.sender}`} 
                                    alt={`${message.sender}'s avatar`}
                                />
                                <div>
                                    <p className="font-semibold text-white">{message.sender}</p>
                                    <p className="text-white mt-1">{message.content}</p>
                                    <p className="text-xs text-gray-300 mt-1">{timeAgo(message.timeStamp)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </main>

            <div className="bg-gray-800 p-4">
                <div className="container mx-auto flex items-center space-x-4">
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
                        className="flex-grow bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                        onClick={sendMessage}
                        className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 transition duration-300 ease-in-out"
                    >
                        <MdSend size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;