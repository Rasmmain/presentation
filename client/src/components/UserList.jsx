import { User, Edit2, Eye } from "lucide-react";

const UserList = ({ users, currentUser, userRole, onUpdateUserRole }) => {
  const getRoleIcon = (role) => {
    switch (role) {
      case "creator":
        return <User className="text-yellow-500" />;
      case "editor":
        return <Edit2 className="text-blue-500" />;
      case "viewer":
        return <Eye className="text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 p-4 w-64">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul>
        {users?.map((user) => (
          <li
            key={user.nickname}
            className="flex items-center justify-between mb-2"
          >
            <span className="flex items-center">
              {getRoleIcon(user.role)}
              <span className="ml-2">{user.nickname}</span>
            </span>
            {userRole === "creator" && user.nickname !== currentUser && (
              <select
                value={user.role}
                onChange={(e) =>
                  onUpdateUserRole(user.nickname, e.target.value)
                }
                className="ml-2 p-1 text-sm"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
