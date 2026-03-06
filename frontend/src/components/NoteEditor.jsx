import {EditorContent,useEditor} from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"

export default function NoteEditor({content,setContent}){

const editor = useEditor({

extensions:[StarterKit],

content,

onUpdate:({editor})=>{
setContent(editor.getHTML())
}

})

if(!editor) return null

return(

<div className="border rounded">

<div className="flex gap-2 border-b p-2 bg-gray-50">

<button onClick={()=>editor.chain().focus().toggleBold().run()}>
B
</button>

<button onClick={()=>editor.chain().focus().toggleItalic().run()}>
I
</button>

<button onClick={()=>editor.chain().focus().toggleBulletList().run()}>
•
</button>

</div>

<EditorContent editor={editor} className="p-3 min-h-[120px]"/>

</div>

)

}