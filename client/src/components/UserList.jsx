import  { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const UserList = () => {
  const { users } = useContext(SocketContext);

  const handleRoleChange = (userId, role) => {
    socket.emit("change-role", { userId, role });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Connected Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id} className="flex justify-between items-center">
            <span>{user.nickname}</span>
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
            >
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
