import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
export default function App() {
  const [showAddfriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, SetSelectedFriend] = useState(null);
  // const [showSplitForm, setShowSplitForm] = useState(false);

  function handleShowFriend() {
    setShowAddFriend((show) => !show);
  }
  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  }
  function handleSelection(friend) {
    SetSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  }
  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    console.log(value);
    SetSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelection={handleSelection}
          selectedFriend={selectedFriend}
        />

        {showAddfriend && <AddFriend onAddFriend={handleAddFriend} />}
        <Button onClick={handleShowFriend}>
          {showAddfriend ? "close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          // using the key to reset the form content go back to section "how react really works" videos 7->13
          selectedFriend={selectedFriend}
          onSplit={handleSplitBill}
        />
      )}
    </div>
  );
}
function FriendList({ friends, onSelection, selectedFriend }) {
  // const friends = initialFriends;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelection={onSelection}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelection, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => onSelection(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");
  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: ` ${image}?= ${id}`,
      balance: 0,
      id,
    };
    console.log(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
    onAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑 friend name</label>
      <input
        type="text"
        placeholder="friend name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📸 Image URL</label>
      <input
        type="text"
        placeholder="image url"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}
function FormSplitBill({ selectedFriend, onSplit }) {
  const [billValue, setBillValue] = useState("");
  const [myExpence, setMyExpence] = useState("");
  const friendExpence = billValue ? billValue - myExpence : "";
  const [whoPays, setWhoPays] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!billValue || !myExpence) return;
    onSplit(whoPays === "user" ? friendExpence : -myExpence);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split a bill with {selectedFriend.name}</h2>
      <label>👉Bill cost</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue(Number(e.target.value))}
      />
      <label>👉your expense</label>
      <input
        type="text"
        value={myExpence}
        onChange={(e) =>
          setMyExpence(
            Number(e.target.value) > billValue
              ? myExpence
              : Number(e.target.value)
          )
        }
      />
      <label>👉{selectedFriend.name}'s expense</label>
      <input
        type="text"
        disabled
        value={friendExpence}

        // value={friendExpence}
        // onChange={(e) => CalcFriendExpence}
      />
      <label>🤑Who is paying</label>

      <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button> Split the bill</Button>
    </form>
  );
}
