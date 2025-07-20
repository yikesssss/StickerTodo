'use client';
import Image from "next/image";
import Link from 'next/link';
import TaskInput from "@/components/TaskInput";
import TodoList from "@/components/TodoList";

export default function Home() {
  // const { tasks, addTask } = useTasks();

  return (
    <div>
      <h1 className="text-center text-3xl font-bold">Sticker Task Traker</h1>
      <div>
        <TaskInput />
      </div>

      <div>
        <TodoList />
      </div>
      
      {/* <p>this is where you would see a preview of the stickers you have</p> */}

      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-300 mb-3">Your Stickers:</h2>
        {/* Placeholder for stickers preview */}
        <div className="flex flex-wrap gap-2 text-4xl">
          <span className="p-1 rounded-md bg-gray-700">❤️</span>
          <span className="p-1 rounded-md bg-gray-700">😀</span>
          <span className="p-1 rounded-md bg-gray-700">☘️</span>
          <span className="p-1 rounded-md bg-gray-700">🌹</span>
        </div>
      </div>

      <Link href="/board">Go to Sticker Board</Link>
    </div>
  );
}
