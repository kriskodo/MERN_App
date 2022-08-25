import React from 'react';
import UserItem from "./UserItem";
import "./UsersList.css";
import Card from "../../shared/components/UIElements/Card";

const UsersList = props => {
    if (props.users.length === 0) {
        return <Card className="center">
            <h2>No users found.</h2>
        </Card>
    }
    return <ul className="users-list">
        {props.users.map(user => (
            <UserItem
                key={user.id}
                id={user.id}
                name={user.name}
                image={user.image}
                placeCount={user.places.length}
            />
        ))}
    </ul>
};

export default UsersList;