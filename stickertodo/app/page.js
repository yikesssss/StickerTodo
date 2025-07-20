'use client';
import Image from "next/image";
import Link from 'next/link';
import TaskInput from "@/components/TaskInput";

export default function Home() {
  // const { tasks, addTask } = useTasks();

  return (
    <div>
      <h1 className="text-center text-3xl font-bold">Sticker Task Traker</h1>
      <TaskInput />
      
      <p>this is where you would see a preview of the stickers you have</p>
      
      <Link href="/board">Go to Sticker Board</Link>
    </div>
  );
}
