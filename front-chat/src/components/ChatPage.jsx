import React, { useState,useRef, useEffect } from "react";
import { MdAttachEmail, MdAttachFile, MdSend } from "react-icons/md";
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
    const {roomId, currentUser,connected, setConnected,setRoomId, setCurrentUser} = useChatContext();
    useEffect( ()=> {
            if(!connected){
                navigate("/");
            }
    }, [connected,roomId, currentUser])
    const [messages,setMessages]= useState([
    ]);
    const [input, setInput] = useState("");
    const inputRef= useRef(null);
    const chatBoxRef = useRef(null);
    const [stompClient, setStompClient] = useState(null);

    // On Page init : 
    // Load Messages. 
    useEffect( ()=>{
        async function loadMessages() {
            try {
                    const allMessages= await getMessages(roomId);
                    // console.log(allMessages);
                    setMessages(allMessages);
            } catch (error) {
                
            }
        }
        if(connected){
            loadMessages();
        }
    })

    useEffect(()=>{
        if(chatBoxRef.current){
            chatBoxRef.current.scroll({
                top:chatBoxRef.current.scrollHeight,
                behavior: "smooth",
            });
        }
    },[messages]);


    //Init StompClient
    // Subscribe
    useEffect(()=>{
        
        const connectWebSocket = () =>{
            ///SockJS
            const sock = new SockJS(`${baseURL}/chat`);
            const client = Stomp.over(sock);

            client.connect({}, ()=>{
                setStompClient(client);

                toast.success("Connected!");
                client.subscribe(`/topic/room/${roomId}`, (message) =>{
                    console.log(message);
                    const newMessages = JSON.parse(message.body);
                    setMessages((prev)=>[...prev, newMessages]);
                    //rest of the work will be done after success receiving the message.
                });
            });
        };
        if(connected){
            connectWebSocket();
        }
        //stomp client
    }, [roomId])


    //Send message handler
    const sendMessage = async () =>{
        if(stompClient && connected && input.trim() ){
            console.log(input);
            const message= {
                sender: currentUser,
                content: input,
                roomId: roomId
            }
            stompClient.send(`/app/sendMessage/${roomId}`,{}, JSON.stringify(message));
            setInput("");
        }
    };

    function handleLogOut() {
        if(stompClient!==null)
            stompClient.disconnect();
        setConnected(false);
        setRoomId("");
        setCurrentUser("");
        navigate("/");
    }


    return ( <div className="">
        {/* Header Portion */}
        <header className="dark:border-gray-700 h-20  fixed w-full py-5 dark:bg-gray-900 shadow flex justify-around items-center">
            {/* Room Name */}
            <div>
                <h1 className="text-xl font-semibold ">
                    Room: <span>{roomId}</span>
                </h1>
            </div>
            {/* User Name */}
            <div>
                <h1 className="text-xl font-semibold ">
                    User: <span>{currentUser}</span>
                </h1>
            </div>
            {/* Leave Room Button */}
            <div>
                <button onClick={handleLogOut} className="dark:bg-red-500 hover:dark:bg-red-700 px-3 py-2 rounded-full">
                    Leave Room 
                </button>
            </div>


        </header>
        {/* Chats Section */}
        <main ref={chatBoxRef} className="py-20 px-10 w-2/3 dark:bg-slate-600 mx-auto h-screen overflow-auto">
            {
                messages.map((message, index) =>(
                    <div key={index} className={`flex ${message.sender==currentUser?'justify-end':'justify-start'}`}>
                        <div className={`my-2 ${message.sender==currentUser? 'dark:bg-green-500': 'dark:bg-blue-500'} p-2 rounded max-w-xs`}>
                            <div className="flex flex-row gap-2">
                                <img 
  className="h-10 w-10 rounded-full" 
  src={`https://api.dicebear.com/6.x/avataaars/svg?seed=${message.sender}`} 
  alt={`${message.sender}'s avatar`}
/>
                                <div className=" flex flex-col gap1">
                                        <p className="text-sm font-bold">{message.sender}</p>
                                        <p>{message.content}</p>
                                        <p className="text-xs text-gray-400">{timeAgo(message.timeStamp)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                ))
            }
        </main>

        {/* Messaging Section */}
         <div className=" fixed bottom-4 w-full h-16 ">
        <div className="h-full  pr-10 gap-4 flex items-center justify-between rounded-full w-1/2 mx-auto dark:bg-gray-900">
                <input type="text" 
                onKeyDown={(e)=>{
                    if(e.key=== "Enter"& !e.shiftKey) 
                    {
                        e.preventDefault(); // prevent newline
                        sendMessage();
                    }
                }}
                placeholder="Type your message here." 
                value={input}
                onChange= {
                    (e)=>{
                        setInput(e.target.value);
                    }
                }
                className=" w-full  dark:border-gray-600 b dark:bg-gray-800  px-5 py-2 rounded-full h-full focus:outline-none  
                "/>
                <div className="flex gap-1">
                    <button className="dark:bg-purple-600 h-10 w-10  flex   justify-center items-center rounded-full">
                    <MdAttachFile size={20} />
                    </button>
                    <button
                    onClick={sendMessage}
                    className="dark:bg-green-600 h-10 w-10  flex   justify-center items-center rounded-full"
                    >
                    <MdSend size={20} />
                    </button>
          </div>

            </div>
        </div>
    </div>
    );    
};

export default ChatPage;