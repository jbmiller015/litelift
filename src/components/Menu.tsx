import Link from "next/link";

export default function Menu(){
 return(<div className="w-100 h-14 border rounded-lg m-2">
  <Link href={'/'}><div className="btn w-14 h-full b bg-gray-200 rounded text-black text-center">Home</div></Link>
 </div>)
}
