import { useEffect, useMemo, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { UserSearchProps, ChatState } from "../types";

function UserSearch({}: UserSearchProps) {
  const { searchUsers, searchResults, setSelectedUser, isUsersLoading } = useChatStore() as ChatState;
  const [query, setQuery] = useState<string>("");

  // simple debounce
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.trim() === "") return;
    searchUsers(debouncedQuery);
  }, [debouncedQuery, searchUsers]);

  const hasResults = useMemo(() => searchResults && searchResults.length > 0, [searchResults]);

  return (
    <div className="px-4 mb-2">
      <input
        type="text"
        placeholder="Search users by name or email..."
        className="input input-bordered input-sm w-full bg-slate-900/70 text-slate-200 placeholder:text-slate-500"
        value={query}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      />

      {/* Results dropdown */}
      {query.trim() !== "" && (
        <div className="mt-2 max-h-64 overflow-y-auto rounded-lg border border-slate-700/60 bg-slate-900/80 backdrop-blur-sm">
          {isUsersLoading ? (
            <div className="p-3">
              <UsersLoadingSkeleton />
            </div>
          ) : hasResults ? (
            searchResults.map((u) => (
              <button
                key={u._id}
                className="w-full text-left px-3 py-2 hover:bg-cyan-500/10 flex items-center gap-3"
                onClick={() => {
                  setSelectedUser(u);
                  setQuery("");
                }}
              
              >
                <div className="avatar">
                  <div className="size-8 rounded-full">
                    <img src={u.profilePic || "/avatar.png"} alt={u.fullName} />
                  </div>
                </div>
                <div>
                  <div className="text-slate-200 text-sm">{u.fullName}</div>
                  <div className="text-slate-400 text-xs">{u.email}</div>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-2 text-slate-400 text-sm">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}

function useDebounce(value: string, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default UserSearch;


