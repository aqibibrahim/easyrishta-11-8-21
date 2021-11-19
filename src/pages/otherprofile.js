import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { Modal } from "react-bootstrap";
import logo from "./images/150X150-LOGO.png";
import female from "./images/female.png";
import male from "./images/male.png";
import { Link, useLocation } from "react-router-dom";
import { db } from "../../src/pages/firebase-config";
import { useQuery } from "react-query";
import firebase from "firebase";
import "./otherprofile.css";
export default function Otherprofile() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  var docsid = "";
  var friends_status = false;

  // var inviteslength = 0;
  // var favrioutes = [];
  // const { otheruserid } = useParams();
  const { query } = useLocation();
  var loggedin_userid = localStorage.getItem("loggedin-userid");
  var loggedin_profile_pic = localStorage.getItem("profilepic");
  var loggedin_username = localStorage.getItem("username");

  console.log(query);

  const Otherprofile = useQuery(
    "Otherprofile",
    () => {
      return db.doc(`users/${query.userid}`).get();
    },
    {
      select: (querySnapshot) => {
        // console.log(querySnapshot.data());
        const doc = querySnapshot.data();
        docsid = querySnapshot.id;
        console.log("DOC ::", doc);
        console.log("DOC ::", docsid);
        return doc;
      },
      onError: (error) => console.log("Error getting documents: ", error),
    }
  );

  const profiles = useQuery(
    "profiles",
    () => {
      console.log(query.userid);
      return db.doc(`users/${localStorage.getItem("loggedin-userid")}`).get();
    },
    {
      select: (querySnapshot) => {
        console.log(querySnapshot);
        const doc = querySnapshot.data();
        const docsid = querySnapshot.id;
        console.log("ProfileDOC ::", doc);
        console.log("DOC ::", docsid);
        return doc;
      },
      onError: (error) => console.log("Error getting documents: ", error),
    }
  );

  const sendinvites = () => {
    console.log("button clicked");
    const data = {
      userid: loggedin_userid,
      requestperson: loggedin_username,
      recieverid: query.userid,
      profilepic: loggedin_profile_pic,
      type: "intrest",
    };
    db.collection("invites")
      .add(data)
      .then((res) => {
        console.log(res, "resquest send succesfully");
      });
  };
  const sendphotorequest = () => {
    alert("button clicked");
    const data = {
      userid: loggedin_userid,
      requestperson: loggedin_username,
      recieverid: query.userid,
      profilepic: loggedin_profile_pic,
      type: "photo",
    };
    db.collection("invites")
      .add(data)
      .then((res) => {
        console.log(res, "Photo resquest send succesfully");
      });
  };
  const photosend = () => {
    alert("Dta");
  };
  const sendChatInvites = () => {
    console.log("button clicked");
    const data = {
      userid: loggedin_userid,
      requestperson: loggedin_username,
      recieverid: query.userid,
      profilepic: loggedin_profile_pic,
      type: "chat",
    };
    db.collection("invites")
      .add(data)
      .then((res) => {
        console.log(res, "resquest send succesfully");
      });
  };
  const addtofavriote = () => {
    console.log(Otherprofile.data);
    const data = {
      userid: docsid,
      address: Otherprofile.data.profile.address,
      education: Otherprofile.data.profile.education,
      name: Otherprofile.data.profile.fullname,
      profilepic: Otherprofile.data.profilepic,
      profession: Otherprofile.data.profile.profession,
    };
    db.collection("users")
      .doc(loggedin_userid)
      .update({
        favrioutes: firebase.firestore.FieldValue.arrayUnion(data),
      });
  };

  const unfavriote = () => {
    console.log(Otherprofile.data);
    const data = {
      userid: docsid,
      address: Otherprofile.data.profile.address,
      education: Otherprofile.data.profile.education,
      name: Otherprofile.data.profile.fullname,
      profilepic: Otherprofile.data.profilepic,
      profession: Otherprofile.data.profile.profession,
    };
    db.collection("users")
      .doc(loggedin_userid)
      .update({
        favrioutes: firebase.firestore.FieldValue.arrayRemove(data),
      });
  };

  if (!Otherprofile.data)
    return (
      <div class="lds-heart " style={{ position: "absolute", top: "50%", left: "50%" }}>
        <div></div>
      </div>
    );

  // console.warn("Otherprofile ::  ", Otherprofile.data);
  console.log(Otherprofile.data.friends);
  if (Otherprofile.data.friends) {
    console.log("Friends exist");
    for (var i = 0; i < Otherprofile.data.friends.length; i++) {
      if (Otherprofile.data.friends[i].userid == localStorage.getItem("loggedin-userid")) {
        console.log("Logged in user exist");
        friends_status = true;
      } else {
        friends_status = false;
      }
    }
  }
  console.log("Profiler id", docsid);
  console.log("Favrioutes Length", profiles.data);
  // console.warn("invites ::  ", invites.data);

  return (
    <div>
      <body class="hold-transition sidebar-mini" />
      <div class="wrapper">
        {/*  <!-- Navbar --> */}
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
          {/*   <!-- Left navbar links --> */}
          <ul class="navbar-nav">
            {/* <li class="nav-item">
              <a class="nav-link" data-widget="pushmenu" href="#">
                <i class="fas fa-bars"></i>
              </a>
            </li> */}
          </ul>

          {/* <!-- Right navbar links --> */}
          <ul class="navbar-nav ml-auto">
            <li class="nav-item dropdown">
              <a class="nav-link" href="/notifications" rel="noreferrer noopener" target="_blank">
                <i class="far fa-bell"></i>
                <span class="badge badge-warning navbar-badge">{localStorage.getItem("inviteslength")}</span>
              </a>
            </li>
          </ul>
        </nav>
        {/*  <!-- /.navbar --> */}

        {/*  <!-- Main Sidebar Container --> */}
        <aside class="main-sidebar sidebar-dark-primary elevation-4" style={{ background: "#EDCBBD " }}>
          {/* <!-- Brand Logo --> */}
          <a href="index.html" class="brand-link">
            <img src={logo} alt="AdminLTE" style={{ height: "auto", width: "70%", paddingLeft: "30%" }} />
          </a>

          {/*  <!-- Sidebar --> */}
          <div class="sidebar">
            {/* <!-- Sidebar user (optional) --> */}
            <div class="user-panel mt-3 pb-3 mb-3 d-flex">
              <div
                class="image"
                style={{
                  display: "flex",
                  paddingLeft: "0.8rem",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img src={localStorage.getItem("profilepic")} class="img-circle elevation-2" alt="Profile" style={{ width: "2.1rem", height: "2.1rem" }} />
              </div>
              <div class="info">
                <Link to={"/profile"} class="d-block" style={{ color: "black" }}>
                  {localStorage.getItem("username")}
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
                    <p>My Profile </p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to={"/MatchMaking"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-search"></i>
                    <p>Find Match</p>
                  </Link>
                </li>

                <li class="nav-item">
                  <Link to={"/search"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-search"></i>
                    <p>Search</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to={"/chat"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-envelope"></i>
                    <p>Chat</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to={"/preferences"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-envelope"></i>
                    <p>Set Preferences</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to={"/register"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-user"></i>
                    <p>Update Pofile</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                <li class="nav-item">
                  <Link to={"/membership"} class="nav-link" style={{ color: "black" }}>
                    <i class="nav-icon fas fa-user"></i>
                    <p>Membership</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                <li class="nav-item nav-item-mobile">
                  <a class="nav-link" data-widget="pushmenu" href="#">
                    <i class="fas fa-bars"></i>
                  </a>
                </li>
              </ul>
            </nav>
            {/*  <!-- /.sidebar-menu --> */}
          </div>
          {/*  <!-- /.sidebar --> */}
        </aside>

        {/*  <!-- Content Wrapper. Contains page content --> */}
        <div class="content-wrapper">
          {/*  <!-- Content Header (Page header) --> */}
          <section class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-sm-6">
                  <h1>My Profile </h1>
                </div>
                <div class="col-sm-6">
                  
                </div>
              </div>
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>

          {/* <!-- Main content --> */}
          <section class="content">
            <div class="container-fluid">
              <div class="row">
                <div class="col-md-3">
                  {/*   <!-- Profile Image --> */}
                  <div class="card card-primary card-outline">
                    <div class="card-body box-profile">
                      <div class="text-center">{Otherprofile.data.profilepic == "loading" || Otherprofile.data.profilepic == "" ? <img class="profile-user-img img-fluid img-circle  " src={male} alt=" No Image" style={{ height: 200, width: 200 }} /> : <img class="profile-user-img img-fluid img-circle" src={Otherprofile.data.profilepic} alt=" My Profile picture" style={{ height: 200, width: 200 }} />}</div>

                      <h4 class="profile-username text-center">{Otherprofile.data.profile.fullname}</h4>

                      <p class="text-muted text-center" style={{ fontSize: 24 }}>
                        {Otherprofile.data.registration_token}
                      </p>

                      {/* {console.log(Otherprofile.data.friends)} */}

                      {Otherprofile.data.friends ? (
                        //  debugger
                        // Otherprofile.data.friends.filter( (row) => row.userid === localStorage.getItem("userid")  )

                        Otherprofile.data.friends.map((item) => item.userid === localStorage.getItem("loggedin-userid")) ? (
                          // docsid === localStorage.getItem("userid") ? (
                          <button onClick={sendChatInvites} class="btn btn-primary btn-block" style={{ backgroundColor: "#ed225c", fontSize: 10 }}>
                            <b>Send Chat Request</b>
                          </button>
                        ) : (
                          <button onClick={sendinvites} class="btn btn-primary btn-block" style={{ backgroundColor: "#ed225c", fontSize: 10 }}>
                            <b>Like</b>
                          </button>
                        )
                      ) : (
                        <button onClick={sendinvites} class="btn btn-primary btn-block" style={{ backgroundColor: "#ed225c", fontSize: 10 }}>
                          <b>Like</b>
                        </button>
                      )}
                      {/* {profiles.data.favrioutes ? (
                        profiles.data.favrioutes.filter(
                          (row) => row.userid === docsid
                        ) ? (
                          <button
                            onClick={unfavriote}
                            class="btn btn-primary btn-block"
                            style={{ backgroundColor: "#ed225c", fontSize: 10 }}
                          >
                            <b>Unfavriote</b>
                          </button>
                        ) : (
                          <button
                            onClick={addtofavriote}
                            class="btn btn-primary btn-block"
                            style={{ backgroundColor: "#ed225c", fontSize: 10 }}
                          >
                            <b>Add to Favriote</b>
                          </button>
                        )
                      ) : (
                        <button
                          onClick={addtofavriote}
                          class="btn btn-primary btn-block"
                          style={{ backgroundColor: "#ed225c", fontSize: 10 }}
                        >
                          <b>Add to Favriote</b>
                        </button>
                      )} */}

                      {/* {Otherprofile.data.accepted_photo_request ? (
                        Otherprofile.data.accepted_photo_request.map(
                          (row) => row.accepted_user_id === localStorage.getItem("loggedin-userid")
                        ) ? (
                          ""
                        ) : (

                        )
                      ) : (
                        <button
                          onClick={()=> sendphotorequest}
                          class="btn btn-primary btn-block"
                          style={{ backgroundColor: "#ed225c", fontSize: 10 }}
                        >
                          <b>Send Photo Request</b>
                        </button>
                      )} */}
                      {/* <a
                        href=""
                        class="btn btn-primary btn-block"
                        style={{ backgroundColor: "#ed225c", fontSize: 10 }}
                      >
                        <b>Send Chat Request</b>
                      </a>
                      <button
                        onClick={sendinvites}
                        class="btn btn-primary btn-block"
                        style={{ backgroundColor: "#ed225c", fontSize: 10 }}
                      >
                        <b>Like</b>
                      </button> */}

                      <div class="card-body">
                        <button onClick={sendphotorequest} class="btn btn-primary btn-block" style={{ backgroundColor: "#ed225c", fontSize: 10 }}>
                          <b>Send Photo Request</b>
                        </button>
                        <strong>
                          <i class="fas fa-book mr-1"></i> Education
                        </strong>

                        <p class="text-muted">
                          {Otherprofile.data.profile.education}
                          {Otherprofile.data.profile.specialization}
                        </p>

                        <hr></hr>

                        <strong>
                          <i class="fas fa-map-marker-alt mr-1"></i> Location
                        </strong>

                        <p class="text-muted">{Otherprofile.data.profile.address}</p>

                        <hr></hr>

                        <strong>
                          <i class="fas fa-pencil-alt mr-1"></i>
                          General Information
                        </strong>

                        <p class="text-muted">
                          <span class="tag tag-danger">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Caste:{" "}
                            </span>{" "}
                            {Otherprofile.data.profile.cast}
                          </span>
                          <br />
                          <span class="tag tag-success">
                            {" "}
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Age:
                            </span>{" "}
                            {Otherprofile.data.profile.age}
                          </span>
                          <br />
                          <span class="tag tag-info">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Relegious:
                            </span>{" "}
                            {Otherprofile.data.profile.religion}
                          </span>
                          <br />
                          <span class="tag tag-info">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Sect:
                            </span>{" "}
                            {Otherprofile.data.profile.sect}
                          </span>
                          <br />
                          <span class="tag tag-info">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Status:
                            </span>{" "}
                            {Otherprofile.data.profile.martial}
                          </span>
                          <br />
                          <span class="tag tag-warning">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Job Location:
                            </span>{" "}
                            {Otherprofile.data.profile.joblocation}
                          </span>
                        </p>

                        <hr></hr>

                        <strong>
                          <i class="far fa-file-alt mr-1"></i> Other Information
                        </strong>

                        <p class="text-muted">
                          <span class="tag tag-info">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Created By:
                            </span>{" "}
                            {Otherprofile.data.profile.created}
                          </span>
                          <br />
                          <span class="tag tag-info">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Gender:
                            </span>{" "}
                            {Otherprofile.data.profile.gender}
                          </span>
                          <br />
                          <span class="tag tag-info">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Height:
                            </span>{" "}
                            {Otherprofile.data.profile.height}
                          </span>
                          <br />
                          <span class="tag tag-info">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Nationality:
                            </span>{" "}
                            {Otherprofile.data.profile.nationality}
                          </span>
                          <br />
                          <span class="tag tag-info">
                            <span
                              style={{
                                fontSize: 16,
                                color: "black",
                                fontFamily: "cursive",
                              }}
                            >
                              Parent's Status:
                            </span>{" "}
                            {Otherprofile.data.profile.parentstatus}
                          </span>
                          <br />
                        </p>
                      </div>
                    </div>
                    {/* <!-- /.card-body --> */}
                  </div>
                  {/* <!-- /.card --> */}

                  {/*   <!-- About Me Box --> */}

                  {/*  <!-- /.card --> */}
                </div>
                {/*   <!-- /.col --> */}
                <div class="col-md-9">
                  <div class="card">
                    <div class="card-header p-2">
                      <ul class="nav nav-pills">
                        <li class="nav-item">
                          <a class="nav-link active" href="#activity" data-toggle="tab" style={{ backgroundColor: "#ed225c" }}>
                            Gallery
                          </a>
                        </li>
                        {/* <li class="nav-item">
                          <a class="nav-link" href="#timeline" data-toggle="tab">
                            Timeline
                          </a>
                        </li> */}
                        {/* <li class="nav-item"><a class="nav-link" href="#settings" data-toggle="tab">Settings</a></li> */}
                      </ul>
                    </div>
                    {/* <!-- /.card-header --> */}

                    <div class="card-body">
                      <div class="tab-content">
                        <div class="active tab-pane" id="activity">
                          {/* <!-- Post --> */}

                          {/*  <!-- /.post --> */}

                          {/* <!-- Post --> */}
                          {/* <div class="post clearfix">
                      <div class="user-block">
                        <img class="img-circle img-bordered-sm" src= { logo1 } alt="User Image"/>
                        <span class="username">
                          <a href="#">Sarah Ross</a>
                          <a href="#" class="float-right btn-tool"><i class="fas fa-times"></i></a>
                        </span>
                        <span class="description">Sent you a message - 3 days ago</span>
                      </div>
                      {/* <!-- /.user-block --> */}
                          {/* <p>
                        Lorem ipsum represents a long-held tradition for designers,
                        typographers and the like. Some people hate it and argue for
                        its demise, but others ignore the hate as they create awesome
                        tools to help create filler text for everyone from bacon lovers
                        to Charlie Sheen fans.
                      </p>

                      <form class="form-horizontal">
                        <div class="input-group input-group-sm mb-0">
                          <input class="form-control form-control-sm" placeholder="Response"/>
                          <div class="input-group-append">
                            <button type="submit" class="btn btn-danger">Send</button>
                          </div>
                        </div> */}
                          {/* </form>
                    </div> */}
                          {/*   <!-- /.post --> */}

                          {/*  <!-- Post --> */}
                          <div class="post">
                            {/*  <!-- /.user-block --> */}
                            <div class="row mb-3">
                              <div class="col-sm-12">
                                {Otherprofile.data.profile.gender === "female"
                                  ? (
                                    Otherprofile.data.accepted_photo_request === undefined ? (Otherprofile.data.gallery.map((val) => <img class="img-fluid col-sm-6 image-blur" src={val || female} alt="pic" />)):(
                                     Otherprofile.data.accepted_photo_request.map(row=> row.accepted_user_id == localStorage.getItem("loggedin-userid"))
                                     ?
                                     (Otherprofile.data.gallery.map((val) => <img class="img-fluid col-sm-6" src={val || female} alt="pic" />))
                                     :
                                     (Otherprofile.data.gallery.map((val) => <img class="img-fluid col-sm-6 image-blur" src={val || female} alt="pic" />))

                                    )

                                    )
                                  :
                                  (
                                    Otherprofile.data.gallery.map((val) =>
                                      Otherprofile.data.photo_status === true ? (
                                        <img class="img-fluid col-sm-6 image-blur" src={val || male} alt="Pic" />
                                      ) : (
                                        <div>
                                          <img onClick={handleShow} class="img-fluid col-sm-6 " src={val || male} alt="Pic" />
                                        </div>
                                      )
                                    ))}

                                {/* <button  onClick={myFunBtn}>Open Modal</button> */}

                                {/* <button id="myBtn">Open Modal</button> */}

                                {/* <div id="myModal" className="modal">


  <div className="modal-content">
    <div className="modal-header">
      <span className="close">&times;</span>
      <h2>Modal Header</h2>
    </div>
    <div className="modal-body">
      <p>Some text in the Modal Body</p>
      <p>Some other text...</p>
    </div>
    <div className="modal-footer">
      <h3>Modal Footer</h3>
    </div>
  </div>

</div> */}
                                {/* {Otherprofile.data.photo_status === true
                                      ?  <h1>True </h1> : <h1>false </h1> } */}

                                {/* {Otherprofile.data.profile.gender ==
                                "female" ? (
                                  <img
                                    class="img-fluid col-sm-6"
                                    src={val || logo}
                                    alt="Photo"
                                  />
                                ) : (
                                  <img
                                    class="img-fluid col-sm-6"
                                    src={val || logo}
                                    alt="Photo"
                                  />
                                )} */}

                                {/* {Otherprofile.data.gallery.map((val) => (
                                  <img
                                    class="img-fluid col-sm-6"
                                    src={val || logo}
                                    alt="Photo"
                                  />
                                ))} */}
                              </div>
                              {/* <!-- /.col --> */}
                              {/* <div class="col-sm-6">
                                  <div class="row">
                                    <div class="col-sm-6">
                                      <img class="img-fluid mb-3" src={pic2} alt="Photo" />
                                      <img class="img-fluid" src={pic3} alt="Photo" />
                                    </div> */}
                              {/*  <!-- /.col --> */}
                              {/* <div class="col-sm-6">
                                      <img class="img-fluid mb-3" src={pic4} alt="Photo" />
                                      <img class="img-fluid" src={pic1} alt="Photo" />
                                    </div> */}
                              {/*  <!-- /.col --> */}
                              {/* </div> */}
                              {/*  <!-- /.row --> */}
                              {/* </div> */}
                              {/* <!-- /.col --> */}
                            </div>
                            {/*  <!-- /.row --> */}
                          </div>
                          {/*  <!-- /.post --> */}
                        </div>
                        {/*   <!-- /.tab-pane --> */}
                        {/* <div class="tab-pane" id="timeline">
                          {/* <!-- The timeline --> */}

                        {/*  <!-- timeline time label --> */}

                        {/* <div class="row d-flex align-items-stretch">
                            <div class="col-12 d-flex align-items-stretch">
                              {Otherprofile.data.favrioutes.map((val) => (
                                <div class="card bg-light">
                                  <div class="card-header text-muted border-bottom-0" style={{ textAlign: "center" }}>
                                    {val.address}
                                  </div>
                                  <div class="card-body pt-0">
                                    <div class="row">
                                      <div class="col-7">
                                        <h2 class="lead">
                                          <b>{val.name}</b>
                                        </h2>
                                        <p class="text-muted text-sm">
                                          <b>About: </b> {val.education}{" "}
                                        </p>
                                        <ul class="ml-4 mb-0 fa-ul text-muted">
                                          <li class="small">
                                            <span class="fa-li">
                                              <i class="fas fa-lg fa-building"></i>
                                            </span>{" "}
                                            Address: {val.address}
                                          </li>
                                          <li class="small">
                                            <span class="fa-li">
                                              <i class="fas fa-lg fa-phone"></i>
                                            </span>{" "}
                                            Phone #: + 800 - 12 12 23 52
                                          </li>
                                        </ul>
                                      </div>
                                      <div class="col-5 text-center">
                                        <img src={val.profilepic} alt="" class="img-circle img-fluid" />
                                      </div>
                                    </div>
                                  </div>
                                  <div class="card-footer">
                                    <div class="text-right">
                                      <a href="composeMessage.html" class="btn btn-sm bg-teal">
                                        <i class="fas fa-comments"></i>
                                      </a>
                                      <Link to={"/profile"} class="btn btn-sm btn-primary" style={{ backgroundColor: "#ed225c" }}>
                                        <i class="fas fa-user"></i> View Profile
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div> */}
                        {/*  <!-- /.timeline-label -->
                      <!-- timeline item --> */}

                        {/* <!-- END timeline item -->
                      <!-- timeline item --> */}

                        {/*  <!-- END timeline item -->
                      <!-- timeline item --> */}

                        {/* <!-- END timeline item -->
                      <!-- timeline time label --> */}
                        {/* <div class="time-label">
                              <span class="bg-success">3 Jan. 2014</span>
                            </div> */}
                        {/*  <!-- /.timeline-label -->
                      <!-- timeline item --> */}

                        {/* <!-- END timeline item --> */}
                        {/* <div>
                              <i class="far fa-clock bg-gray"></i>
                            </div> */}
                        {/* </div> */}
                        {/*  <!-- /.tab-pane --> */}

                        <Modal size="lg" show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                          <Modal.Header closeButton>
                            <Modal.Title></Modal.Title>
                          </Modal.Header>
                          <Modal.Body>{Otherprofile.data.profile.gender === "female" ? Otherprofile.data.gallery.map((val) => <img class="img-fluid col-sm-6 image-blur" src={val || female} alt="pic" />) : Otherprofile.data.gallery.map((val) => (Otherprofile.data.photo_status === true ? <img class="img-fluid col-sm-6 image-blur" src={val || male} alt="Pic" /> : <img class="img-fluid col-sm-6 " src={val || male} alt="Pic" />))}</Modal.Body>
                          <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>

                        {/* <!-- /.nav-tabs-custom --> */}
                      </div>
                      {/* <!-- /.col --> */}
                    </div>
                  </div>
                </div>
              </div>

              {/* <!-- /.row --> */}
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>
          {/* <!-- /.content --> */}
        </div>
        {/* <!-- /.content-wrapper --> */}
        <footer class="main-footer text-center">
       <div class="">
            
            <h6 href="">Copyright &copy; 2021  Easyrishta All Right Reserved</h6>.
            </div>

        </footer>
        {/*   <!-- Control Sidebar --> */}
        <aside className="control-sidebar control-sidebar-dark">{/* <!-- Control sidebar content goes here --> */}</aside>
        {/* <!-- /.control-sidebar --> */}
      </div>
      {/* <!-- ./wrapper --> */}
    </div>
  );
}
