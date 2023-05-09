
interface ChatGroupUser {
  userId: number | string;
  firstName: any;
  profilePic: any;
  chatRoomId: any;
  chatRoomType: any;
  latestMessage: any;
  lastUsedDate: any;
  unreadCount: any;
  chatGroupUser: Array<any>;
  chatRoomName: any;
  createdBy: any;
  chatRoomPic: string;
}

//interface ChatGroupUser extends Array<ChatGroupUser>{}

interface ChatRoomList {
  userId: number | string;
  chatRoomId: number | string;
  latestMessage: string;
  lastUsedDate: number;
  unreadCount: number;
  firstName: string;
  profilePic: string;
  chatRoomPic: string;
  chatGroupUser: Array<ChatGroupUser>;
}

interface ChatRoomList extends Array<ChatRoomList>{}


export { ChatRoomList , ChatGroupUser};
