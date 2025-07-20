'use client';
import Image from "next/image";
import Link from 'next/link';
import TaskInput from "@/components/TaskInput";
import TodoList from "@/components/TodoList";

export default function Home() {
  // const { tasks, addTask } = useTasks();

  return (
    <div className="my-3">
      <h1 className="text-center text-3xl font-bold">Sticker Task Traker</h1>
      <div className="mt-3">
        <TaskInput className="flex" />
      </div>

      <div className="mt-2">
        <TodoList />
      </div>
      
      {/* <p>this is where you would see a preview of the stickers you have</p> */}

     

      <Link href="/board">Go to Sticker Board</Link>
    </div>
  );
}
