/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useChat } from '../../context/ChatProvider';
import useChatActions from '../../hooks/useChatActions';


const RoomListContainer = styled.div`
    --space: 1em;
    --horizontal-space: 2vw;
    
    display: flex;
    flex-direction: column;
    width: 26%;
    height: 100%;
    padding-top: var(--vertical-padding);
    overflow: auto;
    background: var( --blue-gradient);
    color: #fff;
    
    & h3 {
        font-size: 1.2em;
        font-weight: 500;
        padding: 0.9em var(--horizontal-space);
    }

    @media (max-width: 820px) {
        position: absolute;
        opacity: ${ props => props.open ? '1' : '0'};
        pointer-events: ${ props => props.open ? 'null' : 'none'};
        right: 0;
        width: 100%;
        border-radius: 0;
        z-index: 1;
    }
`;

const RoomItem = styled.li`
    display: flex;
    gap: 1vw;
    width: 100%;
    flex: 1;
    padding: var(--space) var(--horizontal-space);
    list-style: none;
    background: ${ props => props.active ?  'var(--blue-active-color)' : 'transparent'};
    cursor: pointer;
    transition: all .05s;

    &:hover {
        background: var(--blue-active-color);
    }

    & img {
        height: 3vw;
        width: 3vw;
        border-radius: 20px;
        object-fit: cover;
    }

    & div {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
    
    & span {
        font-weight: 500;
        font-size: 0.8em;
    }
`;


// Static rooms in the chat


const RoomList = () => {
    const { joinRoom, leaveRoom } = useChatActions();
    const { currentRoom, rooms, setCurrentRoom } = useChat();

    const filteredRooms = rooms.filter(room => {
        const includesCaseInsensitive  = {
            name: `${room.users[0].firstName} ${room.users[0].lastName}`.toLowerCase()
        };

        const { name } = includesCaseInsensitive;

        return name.includes("".toLowerCase())
    });

    const handleRoomClick = (roomID) => {
        if(currentRoom?.id === roomID) {
            return;
        }
        if(currentRoom?._id) leaveRoom(currentRoom._id)

        const selectedRoom = rooms.find(room => room._id === roomID);
        setCurrentRoom(selectedRoom);

        joinRoom(roomID);

        // setIsNavOpen(false);
    }
    

    return (
        <RoomListContainer 
            // open={ isNavOpen }
        >
            <h3>Rooms</h3>

            <ul>
                {
                    filteredRooms.map(room => {
                        const { _id, users} = room;

                            return (
                                <RoomItem active={ currentRoom?._id === _id } key={ _id } onClick={ () => handleRoomClick(_id) }>
                                    <img alt='room-img' src={ users[0].avatarURL} />
    
                                    <div>
                                        <span>{ `${users[0].firstName} ${users[0].lastName}` }</span>
                                        
                                    </div>
                                </RoomItem>
                            );
                        
                    })
                }
            </ul>
        </RoomListContainer>
    );
};

export default RoomList;