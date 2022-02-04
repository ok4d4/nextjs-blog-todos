import Layout from "../components/Layout";
import Link from "next/link";
import { getAllTaskData } from "../lib/tasks";
import Task from "../components/Task";
import useSWR from "swr";
import { useEffect } from "react";
import StateContextProvider from "../context/StateContext";
import TaskForm from "../components/TaskForm";


const fetcher = (url) => fetch(url).then((res) => res.json())
const apiUrl = `${process.env.NEXT_PUBLIC_RESTAPI_URL}api/list-task/`


export default function TaskPage({ staticfilterdTasks }) {

    const { data: tasks, mutate } = useSWR(apiUrl, fetcher, {
        fallbackData: staticfilterdTasks
    })

    const filterdTasks = tasks?.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
    )

    useEffect(() => {
        mutate()
    }, [])
    return (
        <StateContextProvider>
            <Layout title="Task Page">
                <TaskForm taskCreated={mutate} />
                <ul>
                    {filterdTasks && filterdTasks.map((task) => <Task key={task.id} task={task} taskDeleted={mutate} />)}
                </ul>
                <Link href="/main-page">
                    <div className="flex cursor-pointer mt-12">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <span>Back to Main Page</span>
                    </div>
                </Link>
            </Layout>
        </StateContextProvider>
    )
}

export async function getStaticProps() {
    const staticfilterdTasks = await getAllTaskData();

    return {
        props: { staticfilterdTasks },
        revalidate: 3
    }
}