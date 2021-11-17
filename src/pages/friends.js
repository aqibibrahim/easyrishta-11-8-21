import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./images/150X150-LOGO.png";
import logo1 from "./images/user1-128x128.jpg";
import { db } from "../../src/pages/firebase-config";
import { useQuery } from "react-query";
export default function Friends() {
  var users_array = [];
  var docsid = "";
  // const profiles = useQuery(
  //   "profile",
  //   () => {
  //     const email = localStorage.getItem("email");
  //     console.log(localStorage.getItem("userid"));
  //     return db.collection("users").where("email", "==", email).get();
  //   },
  //   {
  //     select: (querySnapshot) => {
  //       const doc = querySnapshot.docs[0].data();
  //       docsid = querySnapshot.docs[0].id;
  //       console.log("DOC ::", doc);
  //       // console.log("DOC ::", docsid);
  //       localStorage.setItem("loggedin-userid", localStorage.getItem("userid"));
  //       localStorage.setItem("profilepic", doc.profilepic);
  //       localStorage.setItem("username", doc.profile.fullname);

  //       return doc;
  //     },
  //     onError: (error) => console.log("Error getting documents: ", error),
  //   }
  // );

  const profiles = useQuery(
    "profile",
    () => {
      const email = localStorage.getItem("email");
      console.log(localStorage.getItem("userid"));
      return db.collection("users").where("email", "==", email).get();
    },
    {
      select: (querySnapshot) => {
        const doc = querySnapshot.docs[0].data();
        docsid = querySnapshot.docs[0].id;
        console.log("DOC ::", doc);
        console.log("DOC ::", docsid);
        localStorage.setItem("loggedin-userid", docsid);
        localStorage.setItem("profilepic", doc.profilepic);
        localStorage.setItem("username", doc.profile.fullname);

        return doc;
      },
      onError: (error) => console.log("Error getting documents: ", error),
    }
  );
  console.warn("invites ::  ", profiles.data.friends);
  users_array = profiles.data.friends;


  return (
    <div>
      <div class="wrapper">
        {/* <!-- Navbar --> */}
        <nav class="main-header navbar navbar-expand navbar-white navbar-light">
          {/* <!-- Left navbar links --> */}
          <ul class="navbar-nav">
            
            
          </ul>

     

          {/* <!-- Right navbar links --> */}
          <ul class="navbar-nav ml-auto">
            {/* <!-- Messages Dropdown Menu --> */}
            {/* <li class="nav-item dropdown">
              <a class="nav-link" data-toggle="dropdown" href="#">
                <i class="far fa-comments"></i>
                <span class="badge badge-danger navbar-badge">3</span>
              </a>
              <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                <a href="#" class="dropdown-item">
                  <div class="media">
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      class="img-size-50 mr-3 img-circle"
                    />
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
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <div class="media">
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      class="img-size-50 img-circle mr-3"
                    />
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
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item">
                  <div class="media">
                    <img
                      src={userAvatar}
                      alt="User Avatar"
                      class="img-size-50 img-circle mr-3"
                    />
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
                </a>
                <div class="dropdown-divider"></div>
                <a href="#" class="dropdown-item dropdown-footer">
                  See All Messages
                </a>
              </div>
            </li> */}
            {/* <!-- Notifications Dropdown Menu --> */}
            <li class="nav-item dropdown">
              <a class="nav-link" data-toggle="dropdown" href="/notifications">
                <i class="far fa-bell"></i>
                {/* <!-- Message Start --> */}
                <span class="badge badge-warning navbar-badge">
                  {localStorage.getItem("inviteslength")}
                </span>
              </a>

            </li>
            <li class="nav-item nav-item-mobile">
              <a class="nav-link" data-widget="pushmenu" href="#">
                <i class="fas fa-bars"></i>
              </a>
            </li>
            <li class="nav-items logout-btn">
            <a class="nav-link-custom  mx-auto" onClick={()=> {window.location.href="/"}} >Logout</a>
            </li>
          </ul>
        </nav>
        {/* <!-- /.navbar -->

  <!-- Main Sidebar Container --> */}
        <aside
          class="main-sidebar sidebar-dark-primary elevation-4"
          style={{ background: "#EDCBBD " }}
        >
          {/* <!-- Brand Logo --> */}
          <a href="/" class="brand-link">
            <img
              src={logo}
              alt="AdminLTE"
              style={{ height: "auto", width: "70%", paddingLeft: "30%" }}
            />
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
                <img
                  src={localStorage.getItem("profilepic")}
                  class="img-circle elevation-2"
                  alt="Profile"
                  style={{ width: "2.1rem", height: "2.1rem" }}
                />
              </div>
              <div class="info">
                <Link
                  to={"/profile"}
                  class="d-block"
                  style={{ color: "black" }}
                >
                  {localStorage.getItem("username")}
                </Link>
              </div>
            </div>

            {/* <!-- Sidebar Menu --> */}
            <nav class="mt-2">
              <ul
                class="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {/* <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library --> */}

                <li class="nav-item">
                  <Link
                    to={"/profile"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-user"></i>
                    <p>My Profile</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/MatchMaking"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fa fa-list" aria-hidden="true"></i>
                    <p>Find Match</p>
                  </Link>
                </li>

                <li class="nav-item">
                  <Link
                    to={"/search"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-search"></i>
                    <p>Search</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/chat"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fa fa-comments-o" aria-hidden="true"></i>

                    <p>Chat</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/preferences"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-envelope"></i>
                    <p>Set Preferences</p>
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/register"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                   <i class="nav-icon fas fa-refresh"></i>
                    <p>Update Pofile</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/friends"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class=" nav-icon fa fa-users" aria-hidden="true"></i>
                    <p>Friends</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                <li class="nav-item">
                  <Link
                    to={"/membership"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                   <i class=" nav-icon  fa fa-medium" aria-hidden="true"></i>

                    <p>Membership</p>
                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                <li class="nav-item mt-2">
                  <Link
                    // to={"/home"}
                    to={{pathname:"/home"}}
                    class="nav-link"
                    style={{ color: "black" }}
                    refresh="true"
                  >
                    {/* <i class="nav-icon fas fa-user"></i> */}
                    <a class="nav-link active  mx-auto" onClick={()=> {window.location.href="/"}} >Logout</a>
                    {/* <button onClick={ refreshPage } variant="secondary" size="sm" className="nav-link active  mx-auto">Logout</button> */}

                    {/* <MDBBadge color="danger" className="ml-2">{inviteslength}</MDBBadge> */}
                  </Link>
                </li>
                {/* <li class="nav-item">
                  <Link
                    to={"/notifications"}
                    class="nav-link"
                    style={{ color: "black" }}
                  >
                    <i class="nav-icon fas fa-user"></i>
                    <p>Notifications</p>
                    <MDBBadge color="danger" className="ml-2">
                      {inviteslength}
                    </MDBBadge>
                  </Link>
                </li> */}
              </ul>
            </nav>
            {/*  <!-- /.sidebar-menu --> */}
          </div>
          {/*  <!-- /.sidebar --> */}
        </aside>

        {/* <!-- Content Wrapper. Contains page content --> */}
        <div class="content-wrapper">
          {/* <!-- Content Header (Page header) --> */}
          <section class="content-header">
            <div class="container-fluid">
              <div class="row mb-2">
                <div class="col-sm-6">
                  <h1>Friends List</h1>
                </div>
                <div class="col-sm-6">
                  <ol class="breadcrumb float-sm-right">
                    <li class="breadcrumb-item">
                      <a href="index.html">Home</a>
                    </li>
                    <li class="breadcrumb-item active">Find Match</li>
                  </ol>
                </div>
              </div>
            </div>
            {/* <!-- /.container-fluid --> */}
          </section>

          <section class="content">
            <div class="row">
              <div class="col-md-2"></div>
            </div>
          </section>
          {/* <!-- Main content --> */}
          <section class="content">
            {/* <!-- Default box --> */}
            {/* <div class="card card-solid">
        <div class="card-body pb-0"> */}
            <div class="row d-flex align-items-stretch">
              <div class="d-flex align-items-stretch flex-wrap justify-content-center">
                {users_array.length > 0 ? (
                  users_array.map((val) => (
                    <div
                      class="card col-12 col-md-3 bg-light m-2"
                      style={{
                     
                        height: "auto",
                        marginLeft: "2.5%",
                      }}
                    >
                      <div
                        class="card-header text-muted border-bottom-0"
                        style={{ textAlign: "center" }}
                      ></div>
                      <div class="card-body pt-0">
                        <div class="row">
                          <div class="col-7">
                            <h2 class="lead">
                              <b>{val.name}</b>
                            </h2>
                          </div>
                          <div class="col-5 text-center">
                            <img
                              src={val.userpic}
                              alt=""
                              class="img-circle mt-4"
                              width="60px"
                              height="60px"
                            />
                          </div>
                        </div>
                      </div>
                      <div class="card-footer">
                        <div class="text-right">
                          {/* <a
                            href="composeMessage.html"
                            class="btn btn-sm bg-teal"
                          >
                            <i class="fas fa-comments"></i>
                          </a> */}
                          <Link
                            to={{
                              pathname: "/otherprofile",
                              query: { userid: val.userid },
                            }}
                            class="btn btn-sm btn-primary"
                            style={{ backgroundColor: "#ed225c" }}
                          >
                            <i class="fas fa-user"></i> View Profile
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <h1>No Record Found</h1>
                )}
              </div>
            </div>
            {/* </div> */}
            {/* <!-- /.card-body --> */}
            {/* <div class="card-footer">
              <nav aria-label="Find Matchs Page Navigation">
                <ul class="pagination justify-content-center m-0">
                  <li class="page-item active">
                    <a class="page-link" href="#">
                      1
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      2
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      3
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      4
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      5
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      6
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      7
                    </a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#">
                      8
                    </a>
                  </li>
                </ul>
              </nav>
            </div> */}
            {/* <!-- /.card-footer --> */}
            {/* </div> */}
            {/* <!-- /.card --> */}
          </section>
          {/* <!-- /.content --> */}
        </div>
        {/* <!-- /.content-wrapper --> */}

       
        <footer class="main-footer">
          <strong>
            Copyright &copy; 2021{" "}
            <a href=""> Easyrishta</a>.
          </strong>
      
        </footer>

        {/* <!-- Control Sidebar --> */}
        <aside class="control-sidebar control-sidebar-dark">
          {/* <!-- Control sidebar content goes here --> */}
        </aside>
        {/* <!-- /.control-sidebar --> */}
      </div>
    </div>
  );
}
