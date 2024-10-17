import { EditorComponent } from "@/components/Editor";
import Image from "next/image";


export default function Home() {

  return (
     <div className="h-screen">
        <h1>Latex Editor</h1>
        <EditorComponent />
     </div>
  )
}
