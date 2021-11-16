import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./images/150X150-LOGO.png";
import logo1 from "./images/user1-128x128.jpg";
import chatUser from "./images/chat-user.jpg";
import user from "./images/user1-128x128.jpg";
import userAvatar from "./images/user4-128x128.jpg";
import { auth, db } from "../../src/pages/firebase-config";
import firebase from "firebase";
import "./chat.css";
import { useQuery } from "react-query";
export default function Char() {
  //   useEffect(() => {});
  const [selectedUser, setSelectedUSer] = useState("");
  const [message, setMessage] = useState("");
  const [chat_array, setChat_array] = useState("");
  const [chatsid, setchatids] = useState("");
  var accepted_chat_array = [];
  var chat_ids = [];
  var chatid = "";

  // useEffect(()=>{
  //   const userid = localStorage.getItem("loggedin-userid");
  //   db.collection("users").doc(userid).get().then(res=>{
  //     console.log(res);
  //   })
  // })
  const GetChats = useQuery(
    "getchats",
    () => {
      const userid = localStorage.getItem("loggedin-userid");
      //console.log(localStorage.getItem("userid"));
      return db.collection("users").doc(userid).get();
    },
    {
      select: (querySnapshot) => {
        const doc = {
          accepted_chat_array: querySnapshot.data().accepted_chat_request,
          chat_ids: querySnapshot.data().chat_ids,
        };
        console.log("userData", doc);
        chat_ids = doc.chat_ids;
        accepted_chat_array = doc.chat_ids;
        return doc;
      },
      onError: (error) => console.log("Error getting documents: ", error),
    }
  );


  const onSelectUesr = (userid) => {
    // setSelectedUSer(userid);
    console.log(userid);
    chatid = userid;
    // setchatids = chatid;
    const messages = [];
    db.collection("chats")
      .doc(chatid)
      .collection("messages")
      .orderBy("timeStamp", "asc")
      .onSnapshot((val) => {
        console.log("true If", val);
        var bar = new Promise((resolve, reject) => {
          val.docs.forEach((mes, index, array) => {
            messages.push(mes.data());
            if (index === array.length - 1) resolve();
          });
        });
        bar.then(() => {
          console.log({ messages });

          setChat_array(messages);
        });
      });
  };
  const handleSendMessage = (chatid) => {
    setChat_array([]);
    const message_send = document.getElementById("message").value
    console.log(message_send)
    console.log(chatsid);
    db.collection("chats")
                  .doc(chatid)
                  .collection("messages")
                  .add({
                    messageText: message_send,
                    senderId: localStorage.getItem("loggedin-userid"),
                    timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                  });
  };
  // console.log(GetChats.data.chat_ids[0].chatid);

  return (
    <div>
      <div class="wrapper">
        {/* <!-- Navbar --> */}
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
          {/* <!-- Left navbar links --> */}
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" data-widget="pushmenu" href="#">
                <i class="fas fa-bars"></i>
              </a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
              <a href=" index.html" class="nav-link">
                Home
              </a>
            </li>
            <li class="nav-item d-none d-sm-inline-block">
              <a href="findMatch.html" class="nav-link">
                {" "}
                Match Making{" "}
              </a>
            </li>
          </ul>

          {/* <!-- SEARCH FORM --> */}
          <form class="form-inline ml-3">
            <div class="input-group input-group-sm">
              <input class="form-control form-control-navbar" type="search" placeholder="Search" aria-label="Search" />
              <div class="input-group-append">
                <button class="btn btn-navbar" type="submit">
                  <i class="fas fa-search"></i>
                </button>
              </div>
            </div>
          </form>

          {/* <!-- Right navbar links --> */}
          <ul class="navbar-nav ml-auto">
            {/* <!-- Messages Dropdown Menu --> */}
            <li class="nav-item dropdown">
              <a class="nav-link" data-toggle="dropdown" href="#">
                <i class="far fa-comments"></i>
                <span class="badge badge-danger navbar-badge">3</span>
              </a>
              <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <a href="#" class="dropdown-item">
                  {/* <!-- Message Start --> */}
                  <div class="media">
                    <img src={userAvatar} alt="User Avatar" class="img-size-50 mr-3 img-circle" />
                    <div class="media-body">
                      <h3 class="dropdown-item-title">
                        Brad Diesel
                        <span class="float-right text-sm text-danger">
                          <i class="fas fa-star"></i>
                        </span>
                      </h3>
                      <p class="text-sm">Call me whenever you can...</p>
                      <p class="text-sm text-muted">
                        <i class="far fa-clock mr-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                  {/* <!-- Message End --> */}
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  {/* <!-- Message Start --> */}
                  <div class="media">
                    <img src={userAvatar} alt="User Avatar" class="img-size-50 img-circle mr-3" />
                    <div class="media-body">
                      <h3 class="dropdown-item-title">
                        John Pierce
                        <span class="float-right text-sm text-muted">
                          <i class="fas fa-star"></i>
                        </span>
                      </h3>
                      <p class="text-sm">I got your message bro</p>
                      <p class="text-sm text-muted">
                        <i class="far fa-clock mr-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                  {/* <!-- Message End --> */}
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  {/* <!-- Message Start --> */}
                  <div class="media">
                    <img src={userAvatar} alt="User Avatar" class="img-size-50 img-circle mr-3" />
                    <div class="media-body">
                      <h3 class="dropdown-item-title">
                        Nora Silvester
                        <span class="float-right text-sm text-warning">
                          <i class="fas fa-star"></i>
                        </span>
                      </h3>
                      <p class="text-sm">The subject goes here</p>
                      <p class="text-sm text-muted">
                        <i class="far fa-clock mr-1"></i> 4 Hours Ago
                      </p>
                    </div>
                  </div>
                  {/* <!-- Message End --> */}
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer">
                  See All Messages
                </a>
              </div>
            </li>
            {/* <!-- Notifications Dropdown Menu --> */}
          </ul>
        </nav>
        {/* <!-- /.navbar -->

  <!-- Main Sidebar Container --> */}
        <aside class="main-sidebar sidebar-dark-primary elevation-4" style={{ background: "#EDCBBD " }}>
          {/* <!-- Brand Logo --> */}
          <a href="/" class="brand-link">
            <img
              src={logo}
              alt="AdminLTE Logo"
              style={{
                height: "auto",
                width: "70%",
                paddingLeft: "30%",
              }}
            />
          </a>

          {/* <!-- Sidebar --> */}
          <div class="sidebar">
            {/* <!-- Sidebar user (optional) --> */}
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
              <div class="image">
                <img src={logo1} class="img-circle elevation-2" alt="User Image" />
              </div>
              <div class="info">
                <Link to={"/profile"} class="d-block" style={{ color: "black" }}>
                  Nina Mcintire
                </Link>
              </div>
            </div>

            {/* <!-- Sidebar Menu --> */}
            <nav class="mt-2">
              <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                {/* <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library --> */}

                <li class="nav-item">
                  <Link to={"/profile"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-user"></i>
                    <p>My Profile</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to={"/MatchMaking"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-search"></i>
                    <p>Find Match</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to={"/messages"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-envelope"></i>
                    <p>Messages</p>
                  </Link>
                </li>
              </ul>
            </nav>
            {/* <!-- /.sidebar-menu --> */}
          </div>
          {/* <!-- /.sidebar --> */}
        </aside>

        {/* <!-- Content Wrapper. Contains page content --> */}


        <div class="content-wrapper">


          {GetChats.data.chat_ids.map((val) => (
            <div class="messaging">
              <div class="inbox_msg">
                <div class="inbox_people">
                  <div class="chat_list active_chat" onClick={() => onSelectUesr(val.chatid)}>
                    {val.userpic == "" ? (
                      <img class="profile-user-img img-fluid img-circle  " src={userAvatar} alt=" No Image" style={{ height: 200, width: 200 }} />
                    ) : (
                      <div class="chat_people">
                        <div class="chat_img">
                          {" "}
                          <img src={val.userpic} className="user-profile" alt="Image" />{" "}
                        </div>
                        <div class="chat_ib">
                          <h5>
                            {val.chatperson} <span class="chat_date">Dec 25</span>
                          </h5>
                          <p>Test, which is a new .</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div class="mesgs">
                <div class="msg_history">


                  {chat_array.length > 0 ? (
                    chat_array.map((val) => (
                      <div
                        style={{
                          justifyContent:
                            val.senderId === localStorage.getItem("userid")
                              ? "right"
                              : "left",
                          display: "flex",
                        }}
                      >
                        <p
                          style={{
                            width: "fit-content",
                            // minWidth: "200px",
                            border:
                              val.senderId === localStorage.getItem("userid")
                                ? "2px solid green"
                                : "2px solid deeppink",
                            color:
                              val.senderId === localStorage.getItem("userid")
                                ? "black"
                                : "black",
                            backgroundColor:
                              val.senderId === localStorage.getItem("userid")
                                ? "grey"
                                : "grey",

                            padding: "8px",
                            borderRadius: "15px",
                            maxWidth: "350px",
                            fontSize: "14px",
                          }}
                        >
                          {val.messageText}
                        </p>
                      </div>
                    //    <div class="incoming_msg">
                    //    <div class="incoming_msg_img">
                    //      {" "}
                    //      <img src={chatUser} alt="sunil" />{" "}
                    //    </div>
                    //    <div class="received_msg chat-bubble">
                    //      <div class="received_withd_msg">
                    //        <p> {val.messageText}</p>
                    //        <span class="time_date"> 11:01 AM | June 9</span>
                    //      </div>
                    //    </div>
                    //  </div>
                    ))
                  ) : (
                    <h1>No Message Found</h1>
                  )}
                </div>
                <div class="type_msg">
                  <div class="input_msg_write">
                    <input type="text" class="write_msg" placeholder="Type a message" id="message"/>
                    <button class="msg_send_btn" type="button" onClick={() => handleSendMessage(val.chatid)}>
                      <i class="fa fa-paper-plane-o" aria-hidden="true"></i>
                    </button>
                  </div>
                </div>
              </div>
              </div>





            </div>
          ))}
        </div>
        {/* -------------------------------------------------------------chat-- */}

        {/* <!-- Main content --> */}

        {/* <!-- /.content --> */}

        {/* <!-- /.content-wrapper --> */}

        <footer class="main-footer">
          <strong>
            Copyright &copy; 2021 <a href="https://quellxcode.com/"> QuellxCode</a>.
          </strong>
          All rights reserved.
        </footer>

        {/* <!-- Control Sidebar --> */}
        <aside class="control-sidebar control-sidebar-dark">{/* <!-- Control sidebar content goes here --> */}</aside>
        {/* <!-- /.control-sidebar --> */}
      </div>
    </div>
  );
}
