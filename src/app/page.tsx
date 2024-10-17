import { EditorComponent } from "@/components/Editor";
import { LaTeXEditorPage } from "@/components/LaTeXEditorPage";
import Image from "next/image";


export default function Home() {

  return (
     <div className="h-screen">
        <LaTeXEditorPage />
     </div>
  )
}
