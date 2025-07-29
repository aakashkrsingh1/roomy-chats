import {React, useState} from "react";
import chatIcon from "../assets/chatIcon.png"
import toast from "react-hot-toast";
import { createRoomApi, joinChatApi } from "../services/RoomService";
import useChatContext from "../context/ChatContext";
import { useNavigate } from "react-router";

const JoinCreateChat = () => {
    const [detail, setDetail] = useState({
        roomId: '',
        userName: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const { setRoomId, setCurrentUser, setConnected } = useChatContext();
    const navigate = useNavigate();

    function handleFormInputChange(event){
        setDetail({
            ...detail,
            [event.target.name]: event.target.value,
        });
    }
    function validateForm(){
        if(detail.roomId ==="" || detail.userName===""){
            toast.error("Invalid Input!")
            return false;
        }
        return true;
    }
   async function joinChat(){
        if(validateForm()){
            setIsLoading(true);
            try {
                const room = await joinChatApi(detail.roomId);
                toast.success("Joined successfully!");
                setCurrentUser(detail.userName);
                setRoomId(room.roomId);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                if(error.status==400){
                    toast.error(error.response.data);
                } else {
                    toast.error("Error in Joining room.");
                }
                console.log("Error in Joining room:", error);
            } finally {
                setIsLoading(false);
            }
        }
    }

   async function createRoom(){
        if(validateForm()){
            setIsLoading(true);
            try {
                const response =  await createRoomApi(detail.roomId);
                console.log(response);
                toast.success("Room Created Successfully!");
                setCurrentUser(detail.userName);
                setRoomId(detail.roomId);
                setConnected(true);
                navigate("/chat");
            } catch (error) {
                console.log(error);
                if(error.status ===400){
                    toast.error("Room already exists!");
                } else {
                    toast.error("Error in creating room");
                }
            } finally {
                setIsLoading(false);
            }
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900">
                <div className="p-8 bg-gray-800 rounded-lg shadow-xl text-center max-w-md w-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-white mb-4">Loading Roomy Chat...</h2>
                    <p className="text-gray-300">
                        The backend is waking up. This might take up to two minutes for the first request.
                        Subsequent operations will be much faster.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-gray-700 to-gray-900">
            <div className="p-8 bg-gray-800 rounded-lg shadow-xl w-full max-w-md transition-all duration-300 ease-in-out transform hover:scale-105">
                <div className="flex justify-center mb-6">
                    <img className="w-24 h-24 object-contain" src={chatIcon} alt="Roomy Chat Icon" />
                </div>
                <h1 className="text-3xl font-bold text-center text-white mb-2">
                    Roomy Chat
                </h1>
                <p className="text-center text-gray-400 mb-8">Join or Create a Room</p>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-300 mb-2">
                            Your Name
                        </label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            value={detail.userName}
                            onChange={handleFormInputChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                    </div>
                    <div>
                        <label htmlFor="roomId" className="block text-sm font-medium text-gray-300 mb-2">
                            Room ID
                        </label>
                        <input
                            type="text"
                            id="roomId"
                            name="roomId"
                            value={detail.roomId}
                            onChange={handleFormInputChange}
                            placeholder="Enter room ID"
                            className="w-full px-4 py-2 bg-gray-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                        />
                    </div>
                    <div className="flex gap-4 justify-center mt-8">
                        <button
                            onClick={joinChat}
                            className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300"
                        >
                            Join
                        </button>
                        <button
                            onClick={createRoom}
                            className="px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300"
                        >
                            Create
                        </button>
                    </div>
                </div>
            </div>
            <footer className="mt-8 text-center text-gray-500 text-xs">
                <p>
                    Developed by{" "}
                    <a
                        href="https://www.linkedin.com/in/akash-kumar-singh-180a4916b/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors duration-300"
                    >
                        Akash KS
                    </a>{" "}
                    |{" "}
                    <a
                        href="https://github.com/aakashkrsingh1"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 transition-colors duration-300"
                    >
                        GitHub
                    </a>
                </p>
            </footer>
        </div>
    );
};

export default JoinCreateChat;