type UserImageCircleProps = {
    user: string;
}
export default function UserImageCircle({user} : UserImageCircleProps) {
  return (
    <img className="size-10 rounded-full ring-2 ring-slate-100" src={`/users/${user}`} alt="User Image" />
  )
}