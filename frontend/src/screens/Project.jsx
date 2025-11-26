import React, { useState, useEffect, useContext, useRef } from 'react'
import { useUserContext } from '../context/user.context'
import { useLocation } from 'react-router-dom'
import axios from '../config/axios'
import { initializeSocket, receiveMessage, sendMessage } from '../config/socket'
import Markdown from 'markdown-to-jsx'
import hljs from 'highlight.js';
import { getWebContainer } from '../config/webContainer.js'
import toast from 'react-hot-toast'


function SyntaxHighlightedCode(props) {
    const ref = useRef(null)

    React.useEffect(() => {
        if (ref.current && props.className?.includes('lang-') && window.hljs) {
            window.hljs.highlightElement(ref.current)

            // hljs won't reprocess the element unless this attribute is removed
            ref.current.removeAttribute('data-highlighted')
        }
    }, [props.className, props.children])

    return <code {...props} ref={ref} />
}


const Project = () => {

    const location = useLocation()

    const [isSidePanelOpen, setIsSidePanelOpen] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [sideChatbot, setSideChatbot] = useState(false)
    const [createFileToogle, setCreateFileToogle] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState(new Set()) // Initialized as Set
    const [project, setProject] = useState(location.state.project)
    const [message, setMessage] = useState('')
    const { user, setUser, setToken, navigate,setProjects } = useUserContext()
    const messageBox = React.createRef()

    const [users, setUsers] = useState([])
    const [messages, setMessages] = useState([]) // New state variable for messages
    const [fileTree, setFileTree] = useState({})

    const [currentFile, setCurrentFile] = useState(null)
    const [openFiles, setOpenFiles] = useState([])

    const [webContainer, setWebContainer] = useState(null)
    const [iframeUrl, setIframeUrl] = useState(null)

    const [runProcess, setRunProcess] = useState(null)

    //select users
    const handleUserClick = (id) => {
        setSelectedUserId(prevSelectedUserId => {
            const newSelectedUserId = new Set(prevSelectedUserId);
            if (newSelectedUserId.has(id)) {
                newSelectedUserId.delete(id);
            } else {
                newSelectedUserId.add(id);
            }

            return newSelectedUserId;
        });
    }

    const send = () => {

        sendMessage('project-message', {
            message,
            sender: user
        })
        setMessages(prevMessages => [...prevMessages, { sender: user, message }]) // Update messages state
        setMessage("")

    }

    function WriteAiMessage(message) {

        const messageObject = JSON.parse(message)

        return (
            <div
                className='overflow-auto bg-zinc-800 text-white rounded-sm p-2'
            >
                <Markdown
                    children={messageObject.text}
                    options={{
                        overrides: {
                            code: SyntaxHighlightedCode,
                        },
                    }}
                />
            </div>)
    }

   // Removed appendIncomingMessage and appendOutgoingMessage functions

    function scrollToBottom() {
        messageBox.current.scrollTop = messageBox.current.scrollHeight
    }

    useEffect(() => (console.log(createFileToogle)), [setCreateFileToogle, createFileToogle])

    //logout
    const handleLogout = async () => {
        try {
            const res = await axios.get('/users/logout');
            if (res.status >= 200 && res.status < 300) {
                toast.success('Successfully Logged Out!', {
                    style: {
                        border: '1px solid #52525B',
                        padding: '16px',
                        color: '#EAB308',
                        background: '#18181B'
                    },
                    iconTheme: {
                        primary: '#EAB308',
                        secondary: '#52525B',
                    },
                });
                setUser(null);
                setToken(null);
                setProjects([]);
                localStorage.clear();
                sessionStorage.clear();
                axios.defaults.headers.common['Authorization'] = ``;
                navigate('/login');
            } else {

                toast.error("Logout Failed", {
                    style: {
                        border: '1px solid #52525B',
                        padding: '16px',
                        color: '#EF4444',
                        background: '#18181B'
                    },
                    iconTheme: {
                        primary: '#EAB308',
                        secondary: '#EF4444',
                    },
                });
            }
        } catch (error) {
            console.log(error.response)
            toast.error(error.response.data.errors || "Something went wrong while log out", {
                style: {
                    border: '1px solid #52525B',
                    padding: '16px',
                    color: '#EF4444',
                    background: '#18181B'
                },
                iconTheme: {
                    primary: '#EAB308',
                    secondary: '#EF4444',
                },
            });
        }
    }

    //specific project data fetch
    useEffect(() => {
        const getProject = async () => {

            try {

                const res = await axios.get(`/projects/get-project/${location.state.project._id}`)
                setProject(res.data.project)
                setFileTree(res.data.project.fileTree || {})
            } catch (error) {
                toast.error("Failed to fetch project data", {
                    style: {
                        border: '1px solid #52525B',
                        padding: '16px',
                        color: '#EF4444',
                        background: '#18181B'
                    },
                    iconTheme: {
                        primary: '#EAB308',
                        secondary: '#EF4444',
                    },
                });
            }
        };
        getProject()

    }, [setProject])
    
    //add collaborators
    const addCollaborators = async () => {
        
        try {
            const res = await axios.put("/projects/add-user", {
                projectId: location.state.project._id,
                users: Array.from(selectedUserId)
            })
            setProject(res.data.project)
            toast.success("Collaborators added successfully", {
                style: {
                    border: '1px solid #52525B',
                    padding: '16px',
                    color: '#EAB308',
                    background: '#18181B'
                },
                iconTheme: {
                    primary: '#EAB308',
                    secondary: '#52525B',
                },
            });
            setIsModalOpen(false)
            
        } catch (error) {
            toast.error("Failed to add collaborators", {
                style: {
                    border: '1px solid #52525B',
                    padding: '16px',
                    color: '#EF4444',
                    background: '#18181B'
                },
                iconTheme: {
                    primary: '#EAB308',
                    secondary: '#EF4444',
                },
            });     
        }
    }

    //get all users
    const getAllUsers = async () => {
        try {
            const res = await axios.get('/users/all')
            setUsers(res.data.users)
            return res.data.users
        } catch (error) {
            toast.error("Failed to fetch Users", {
                style: {
                    border: '1px solid #52525B',
                    padding: '16px',
                    color: '#EF4444',
                    background: '#18181B'
                },
                iconTheme: {
                    primary: '#EAB308',
                    secondary: '#EF4444',
                },
            });
        }
    }

    //update file tree
    const saveFileTree = async (ft)=>{
        try {
            const res = await axiosput('/projects/update-file-tree', {
                projectId: project._id,
                fileTree: ft
            })
            console.log(res.data)
            
        } catch (error) {
            
        }
        
    }

    useEffect(() => {
        getAllUsers()
    }, [user])

    useEffect(() => {

        initializeSocket(project._id)

        if (!webContainer) {
            getWebContainer().then(container => {
                setWebContainer(container)
                console.log("container started")
            })
        }

        receiveMessage('project-message', data => {

            console.log(data)

            if (data.sender._id == 'ai') {
                const message = JSON.parse(data.message)
                console.log(message)
                webContainer?.mount(message.fileTree)
                if (message.fileTree) {
                    setFileTree(message.fileTree || {})
                }
                setMessages(prevMessages => [...prevMessages, data]) // Update messages state
            } else {

                setMessages(prevMessages => [...prevMessages, data]) // Update messages state
            }
        })

    }, [])
    

    return (


        <main className='main-container overflow-hidden h-screen w-screen flex flex-col md:flex-row bg-zinc-900 text-white'

        >


            <section className=" bg-zinc-900 h-full w-full flex flex-col md:flex-row">

                <div className="explorer border-x   border-zinc-600 h-full w-1/5 bg-zinc-950">

                    <div className="file-tree  w-full h-full overflow-auto custom-scrollbar">
                        {
                            Object.keys(fileTree).map((file, index) => (
                                <button
                                    key={index}
                                    onClick={() => {
                                        setCurrentFile(file)
                                        setOpenFiles([...new Set([...openFiles, file])])
                                    }}
                                    className="tree-element  cursor-pointer duration-300 p-1  flex items-center gap-2 bg-zinc-900 w-full hover:bg-zinc-800">
                                    <p
                                        className='text-sm ml-5 text-blue-500'
                                    >file</p>
                                </button>

                            ))

                        }
                    </div>

                </div>
                <div className="code-editor flex flex-col flex-grow h-full w-full shrink">

                    <div className="top border-b  border-zinc-600 flex justify-between w-full bg-zinc-950 ">

                        <div className="files flex">
                            {
                                openFiles.map((file, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentFile(file)}

                                        className={`open-file border-r border-t border-r-zinc-600 border-t-yellow-500  cursor-pointer px-2 py-0 flex items-center justify-between w-fit gap-2 bg-zinc-900 ${currentFile === file ? 'bg-zinc-500' : ''}`}>
                                        <p className='text-base text-yellow-500 ' >file</p>
                                        <i className="ri-close-line  text-yellow-500 px-1 text-base  rounded-md cursor-pointer hover:bg-zinc-800"></i>
                                    </button>
                                ))
                            }
                        </div>

                        <div className="actions flex gap-2 px-3 py-1">
                            <button className='relative group' onClick={handleLogout}>
                                <p className='px-2 py-2 text-sm border border-zinc-600 duration-300 hover:bg-zinc-800 rounded-md cursor-pointer'> Log out <i className="ri-expand-right-fill"></i></p>
                            </button>
                            <button
                                onClick={async () => {
                                    await webContainer.mount(fileTree)


                                    const installProcess = await webContainer.spawn("npm", ["install"])



                                    installProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    if (runProcess) {
                                        runProcess.kill()
                                    }

                                    let tempRunProcess = await webContainer.spawn("npm", ["start"]);

                                    tempRunProcess.output.pipeTo(new WritableStream({
                                        write(chunk) {
                                            console.log(chunk)
                                        }
                                    }))

                                    setRunProcess(tempRunProcess)

                                    webContainer.on('server-ready', (port, url) => {
                                        console.log(port, url)
                                        setIframeUrl(url)
                                    })

                                }}
                                className='relative group'
                            >
                                <i className="ri-play-large-line px-2 py-2 text-base hover:bg-zinc-800 rounded-md cursor-pointer"></i>
                                <p className="hidden group-hover:flex absolute -bottom-6 -left-4 text-[10px] bg-zinc-900 p-1 w-14    rounded-md text-zinc-400">
                                    Run Code
                                </p>

                            </button>

                            <button onClick={() => setSideChatbot(!sideChatbot)} className='relative group '>
                                {sideChatbot ? <i className="ri-layout-right-2-line px-2 py-2 text-base bg-zinc-800 hover:bg-zinc-700 rounded-md cursor-pointer "></i> : <i class="ri-layout-right-line px-2 py-2 text-base hover:bg-zinc-800 rounded-md cursor-pointer "></i>}
                                <p className="hidden group-hover:flex absolute -bottom-6 -left-7 text-[10px] bg-zinc-900 p-1 w-22    rounded-md text-zinc-400">
                                    {!sideChatbot ? "Open chatbot" : "Close chatbot"}
                                </p>
                            </button>


                        </div>
                    </div>
                    <div className="bottom flex flex-grow max-w-full shrink overflow-auto">
                        {
                            fileTree[currentFile] && (
                                <div className="code-editor-area h-full overflow-auto flex-grow bg-zinc-900">
                                    <pre
                                        className="hljs h-full">
                                        <code
                                            className="hljs h-full outline-none bg-zinc-900"
                                            contentEditable
                                            suppressContentEditableWarning
                                            onBlur={(e) => {
                                                const updatedContent = e.target.innerText;
                                                const ft = {
                                                    ...fileTree,
                                                    [currentFile]: {
                                                        file: {
                                                            contents: updatedContent
                                                        }
                                                    }
                                                }
                                                setFileTree(ft)
                                                saveFileTree(ft)
                                            }}
                                            dangerouslySetInnerHTML={{ __html: hljs.highlight('javascript', fileTree[currentFile].file.contents).value }}
                                            style={{
                                                whiteSpace: 'pre-wrap',
                                                paddingBottom: '25rem',
                                                counterSet: 'line-numbering',
                                            }}
                                        />
                                    </pre>
                                </div>
                            )
                        }
                    </div>

                </div>

                {iframeUrl && webContainer &&
                    (
                        <div className="preview-container flex min-w-96 flex-col h-full">
                            <div className="address-bar">
                                <input type="text"
                                    onChange={(e) => setIframeUrl(e.target.value)}
                                    value={iframeUrl}
                                    className="w-full p-2 px-4 bg-zinc-800 text-white outline-none" />
                            </div>
                            <iframe
                                src={iframeUrl}
                                className="w-full h-full"></iframe>
                        </div>
                    )
                }


            </section>



            <section className={`transition-all duration-500  relative border-l border-zinc-600 flex flex-col h-full bg-zinc-950  ${sideChatbot ? 'translate-x-0 w-1/4' : 'translate-x-full w-0'}`}>
                <header className='flex justify-between items-center p-2 gap-1 border-b border-zinc-600 w-full bg-zinc-950 absolute z-2 top-0'>
                    <div className="logo flex items-center justify-center cursor-pointer ml-3">
                        <img src="/logo.png" alt="logo" className="w-8 h-8 " />
                        <p className="mt-1 font-bold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent hand">
                            Kothamala Ai
                        </p>

                    </div>
                    <div className='flex items-center justify-end'>
                        <button
                            className="relative group"
                            onClick={() => setIsModalOpen(true)}
                        >
                            <i className="ri-add-fill px-2 py-2 text-base hover:bg-zinc-800 rounded-md cursor-pointer"></i>

                            <p className="hidden group-hover:flex absolute -bottom-6 -left-9 text-[10px] bg-zinc-900 p-1 w-21    rounded-md text-zinc-400">
                                Add collaborator
                            </p>
                        </button>

                        <button
                            onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                            className='relative group'>
                            <i className="ri-group-fill px-2 py-2 text-base group hover:bg-zinc-800 rounded-md cursor-pointer "></i>
                            <p className="hidden group-hover:flex absolute -bottom-6 -left-9 text-[10px] bg-zinc-900 p-1 w-20 rounded-md text-zinc-400">
                                See collaborator
                            </p>
                        </button>
                    </div>
                </header>
                <div className="conversation-area pt-11 pb-20 flex-grow flex flex-col h-full relative bg-zinc-900">

                    <div
                        ref={messageBox}
                        className="message-box p-3 flex-grow flex flex-col gap-1 overflow-auto max-h-full scrollbar-hide">
                        {messages.map((msg, index) => (
                            <div
                                key={index}

                                className={`message flex flex-col p-2 bg-zinc-700 w-fit rounded-md border border-zinc-600 ${msg.sender._id === 'ai' ? 'max-w-80' : 'max-w-52'} ${msg.sender._id == user._id.toString() && 'ml-auto'}`}
                            >
                                <small className=' text-sm text-yellow-500'>
                                    {/* hii */}
                                    {msg.sender.email}
                                </small>
                                <div className='text-sm '>
                                    {msg.sender._id === 'ai' ?
                                        WriteAiMessage(msg.message)
                                        : <p>{msg.message}</p>}
                                    {/* hello */}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-[100%] h-17 bg-zinc-900 p-4 absolute bottom-3 flex items-end gap-2">

                        {/* Outer Container */}
                        <div className="flex  items-end justify-evenly w-full bg-zinc-700/30 border border-zinc-600 
                    rounded-2xl px-4 py-2">

                            {/* Auto-expanding textarea */}
                            <textarea
                                className="w-full text-yellow-200 text-base 
                       outline-none resize-none max-h-40 overflow-y-auto custom-scrollbar"
                                placeholder="@ai What can I learn today?"
                                rows={1}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onInput={(e) => {
                                    e.target.style.height = "auto"; // reset
                                    e.target.style.height = `${e.target.scrollHeight}px`; // expand
                                }}
                            ></textarea>

                            {/* Send button */}
                            <button
                                onClick={send}
                                className="cursor-pointer ml-2  text-yellow-500 hover:text-blue-500 duration-300 
                           hover:scale-[1.2] ">
                                <i className="ri-send-plane-fill text-xl"></i>
                            </button>

                        </div>

                    </div>

                </div>
                <div className={`sidePanel w-full h-full flex flex-col gap-2 bg-zinc-800/20 backdrop-blur-md absolute transition-all ${isSidePanelOpen ? 'translate-x-0' : 'translate-x-full'} top-0`}>

                    <div className="users flex flex-col mt-14 gap-3 px-3">

                        {project.users && project.users.map(user => {


                            return (
                                <div className="user cursor-pointer duration-300 hover:bg-zinc-900 rounded-xl hover:border border-zinc-600 p-2 flex gap-2 items-center">
                                    <div className='aspect-square rounded-full w-fit h-fit flex items-center justify-center p-5 text-yellow-500 bg-zinc-600'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-base text-white'>{user.email}</h1>
                                </div>
                            )


                        })}
                    </div>
                </div>
            </section>

            {isModalOpen && (
                <div className="fixed inset-0 backdrop-blur-md z-10 duration-500 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-600 w-96 max-w-full relative">
                        <header className='flex justify-between items-center mb-4'>
                            <h2 className='text-xl font-semibold text-yellow-500'>Select User</h2>
                            <button onClick={() => setIsModalOpen(false)} className='p-2'>
                                <i className="ri-close-fill cursor-pointer "></i>
                            </button>
                        </header>
                        <div className="users-list flex flex-col gap-2 mb-5 max-h-96 overflow-auto">
                            {users.map(user => (
                                <div
                                    key={user.id}

                                    className={`user cursor-pointer hover:bg-zinc-800 hover:border border-zinc-600 rounded-xl p-2 flex gap-2 items-center ${Array.from(selectedUserId).indexOf(user._id) != -1 ? 'bg-zinc-800' : ""}`}
                                    onClick={() => handleUserClick(user._id)}
                                >
                                    <div className='aspect-square relative rounded-full w-fit h-fit flex items-center justify-center p-5 text-yellow-500 bg-zinc-700'>
                                        <i className="ri-user-fill absolute"></i>
                                    </div>
                                    <h1 className='font-semibold text-base'>{user.email}</h1>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={addCollaborators}
                            className='relative cursor-pointer w-full p-2 rounded-xl  text-white  bg-transparent focus:outline-none group overflow-hidden z-10 duration-500'>
                            <span className="relative text-lg font-semibold text-white group-hover:text-blue-900 duartion-300 z-9 ">Add Collaborators</span>
                            <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-blue-500 from-30% z-0 to-yellow-500 to-60% top-0 left-0 duration-500 group-hover:-left-70"></div>
                        </button>
                    </div>
                </div>
            )}
        </main>

    )
}

export default Project