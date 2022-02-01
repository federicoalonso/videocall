import React from "react";
import { v1 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";

const CreateRoom = (props) => {
    const navigate = useNavigate();

    function handleClick() {
        const id = uuid();
        navigate(`/room/${id}`);
    }

    return (
        <button type="button" onClick={handleClick}>
            Create Room
        </button>
    );
}

export default CreateRoom;