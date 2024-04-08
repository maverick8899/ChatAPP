import { useState } from 'react';
import ChatBox from '../components/Chat/ChatBox';
import MyChat from '../components/Chat/MyChat';
import SideDrawer from '../components/Chat/SideDrawer';
import store from '../store';
import { Box } from '@chakra-ui/layout';

//
const Chat = () => {
    const user = store((state) => state.data.user);
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div style={{ background: 'none', width: '100%' }}>
            {user && <SideDrawer />}
            <Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChat fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    );
};

export default Chat;
