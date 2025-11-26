import React, { useContext, useState, useEffect } from 'react'
import { useUserContext } from '../context/user.context'
import axios from "../config/axios"
import { useNavigate } from 'react-router-dom'
import { Spotlight } from '../components/ui/spotlight-new'
import toast from 'react-hot-toast'

const Home = () => {

    const { user,setProjects,projects } = useUserContext();

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [projectName, setProjectName] = useState("")


    const navigate = useNavigate()

    async function createProject(e) {
        e.preventDefault()

        const res = await axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                toast.success('Project Created Successfully !! ', {
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
                setProjects([...projects, res.data])
            })
            .catch((error) => {
               
                toast.error(error.response.data|| 'Failed to Create Project', {
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
            })
    }


    useEffect(() => {

        
        async function fetchProjects() {
            if (!user) return;
            try {
                const res = await axios.get('/projects/all');
                setProjects(res.data.projects);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Failed to Fetch Projects', {
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
    
        fetchProjects();
    }, [user]);
    

    return (
        <main className='min-h-screen duration-500 overflow-hidden flex flex-col items-center relative justify-center bg-zinc-950'>

            <Spotlight
                gradientFirst='radial-gradient(
                                55% 100% at 50% 20%,
                                rgba(250, 204, 21, 0.5) 0%,
                                rgba(250, 204, 21, 0.14) 45%,
                                rgba(250, 204, 21, 0.05) 70%,
                                rgba(250, 204, 21, 0) 100%
                              )
                              
                              '


            />



            <div className="logo flex flex-col items-center mb-8">
                <img src="/logo.png" alt="logo" className="w-24 h-24 mb-4" />
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-yellow-500 bg-clip-text text-transparent hand">
                    Kothamala Ai
                </p>

            </div>

            <div className="projects flex flex-col items-center flex-wrap gap-3">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="project w-40 px-2 h-10 border border-zinc-600 rounded-xl bg-zinc-900 cursor-pointer duration-300 hover:bg-zinc-800 text-white">
                    New Project
                    <i className="ri-link ml-2"></i>
                </button>

                <div className='flex flex-wrap gap-3 mt-2'>
                {
                    projects.map((project) => (
                        <div key={project._id}
                            onClick={() => {
                                navigate(`/project`, {
                                    state: { project }
                                })
                            }}
                            className="project flex flex-col gap-2 cursor-pointer p-4 border border-zinc-600 rounded-xl min-w-52 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white duration-300">
                            <h2
                                className='font-bold '
                            >{project.name}</h2>

                            <div className="flex gap-2">
                                <p> <small> <i className="ri-user-line"></i> Collaborators</small> :</p>
                                {project.users.length}
                            </div>

                        </div>
                    ))
                }

                </div>

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center backdrop-blur-md">
                    <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-600 shadow-md w-1/3 text-white">
                        <h2 className="text-xl font-semibold text-blue-500">Create New Project</h2>
                        <form onSubmit={createProject}>
                            <div className="mb-4">
                                <label className="block text-base text-yellow-500 ">Project Name</label>
                                <input
                                    onChange={(e) => setProjectName(e.target.value)}
                                    value={projectName}
                                    placeholder='Kothamala-Ai'
                                    type="text" className="w-full p-2 mt-3 rounded-xl bg-zinc-800 border border-zinc-600 text-yellow-200 focus:outline-none focus:ring-1 focus:ring-blue-500" required />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="mr-2 p-3 border border-zinc-600 w-1/4 bg-zinc-800 rounded-xl text-white hover:bg-zinc-700 cursor-pointer" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="cursor-pointer w-1/4 p-3 rounded-xl relative text-white  bg-transparent focus:outline-none group overflow-hidden z-10 duration-500">
                                    <span className='relative text-lg font-semibold text-white group-hover:text-blue-900 duartion-300 z-9 '>Create</span>
                                    <div className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-blue-500 from-30% z-0 to-yellow-500 to-60% top-0 left-0 duration-500 group-hover:-left-25"></div>

                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </main>
    )
}

export default Home