import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar";
import { motion } from "framer-motion";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { RiPencilFill } from "react-icons/ri";
import { ImageDropzoneButton } from "../../components/ImageDropzoneButton";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import style from "./Profile.module.css";
import { SiGmail } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";
import { FaAddressBook } from "react-icons/fa6";
import { TextInput } from "@mantine/core";
import { MdWork } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { RiUserFollowFill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa6";
import { SkillCardGradient } from "../../components/SkillCardGradient";
import { ToastContainer, toast } from "react-toastify";
import { BsPostcardHeart } from "react-icons/bs";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdAutoGraph } from "react-icons/md";
import { ArticleCard } from "../../components/ArticleCard";
import { MdWorkspacePremium } from "react-icons/md";
import { getUserJobFindingPosts, updateUserProfile } from "../../api/JobSeeker";
import { deleteJobFindingPost } from "../../api/JobSeeker";
import { updateJobSeekerUsername } from "../../api/JobSeeker";
import { updateJobSeekerPassword } from "../../api/JobSeeker";
import { AxiosError } from "axios";

function Profile() {
  const navigate = useNavigate();
  // Helper function for toast messages
  const notifyError = (message: string) =>
    toast.error(message, { position: "top-center" });
  const notifySuccess = (message: string) =>
    toast.success(message, { position: "top-center" });

  const {
    user,
    isLoading,
    refetchjobseeker,
    refetchemployer,
    refetchCompany,
    isStale,
    setUser,
  } = useUser();
  const [isHaveUser, setIsHaveUser] = useState(false);
  useEffect(() => {
    refetchjobseeker();
    refetchCompany();
    refetchemployer();
    // console.log("current user:", user);
    // console.log("isLoading:", isLoading);
    // console.log("isHaveUser :", isHaveUser);
    // console.log("isStale :", isStale);
    setIsHaveUser(!!user);
  }, [user, isLoading, isStale]);
  // Track which tab is active; default is "work"
  const [activeTab, setActiveTab] = React.useState("work");

  // Function to handle tab changes
  const handleTabClick = (tabName: React.SetStateAction<string>) => {
    setActiveTab(tabName);
  };

  // Common classes for all tabs
  const baseTabClasses = "pb-1 transition";

  // Active vs. inactive styles
  const activeClasses =
    "text-gray-900 font-semibold border-b-2 border-gray-900";
  const inactiveClasses = "text-gray-600 hover:text-gray-900";

  const [
    profileDropzoneOpened,
    { toggle: profileDropzoneToggle, close: profileDropzoneClose },
  ] = useDisclosure(false);
  const [
    editProfileOpened,
    { toggle: editProfileToggle, close: editProfileClose },
  ] = useDisclosure(false);
  const [firstNameValue, setFirstNameValue] = useState<string>("");
  const [lastNameValue, setLastNameValue] = useState<string>("");
  const [aboutMeValue, setAboutMeValue] = useState<string>("");
  const [addressValue, setAddressValue] = useState<string>("");
  const [emailValue, setEmailValue] = useState<string>("");
  const [phoneNumberValue, setPhoneNumberValue] = useState<string>("");
  const [firstNameError, setFirstNameError] = useState<string>("");
  const [lastNameError, setLastNameError] = useState<string>("");
  const [aboutMeError, setAboutMeError] = useState<string>("");
  const [addressError, setAddressError] = useState<string>("");
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userNameValue, setuserNameValue] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmpassword, setConfirmPassword] = useState<string>("");

  const [newPassword, setNewPassword] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [confirmpassword2, setConfirmPassword2] = useState<string>("");

  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        const response = await getUserJobFindingPosts();
        setUserPosts(response.data.jobPosts);
      } catch (error) {}
    };
    fetchUserPost();

    setFirstNameValue(user.firstName);
    setLastNameValue(user.lastName);
    setAboutMeValue(user.aboutMe);
    setAddressValue(user.address);
    setEmailValue(user.email);
    setuserNameValue(user.username);
    setPhoneNumberValue(user.contact);

    setFirstNameError("");
    setLastNameError("");
    setAboutMeError("");
    setAddressError("");
  }, [editProfileOpened]);

  const validateEditData = () => {
    let isValidateFirstName = true;
    let isValidateLastName = true;
    let isValidateAddress = true;
    let isValidateEmail = true;
    let isValidatePhoneNumber = true;

    setFirstNameError("");
    setLastNameError("");
    setAboutMeError("");
    setAddressError("");

    // first name validation
    if (firstNameValue == "") {
      isValidateFirstName = false;
      setFirstNameError("Please enter your first name");
      notifyError("Please enter your first name");
    }

    // last name validation
    if (lastNameValue == "") {
      isValidateLastName = false;
      setLastNameError("Please enter your last name");
      notifyError("Please enter your last name");
    }

    // address validation
    if (addressValue == "") {
      isValidateAddress = false;
      setAddressError("Please enter your address");
      notifyError("Please enter your address");
    }

    return (
      isValidateFirstName &&
      isValidateLastName &&
      isValidateAddress &&
      isValidateEmail &&
      isValidatePhoneNumber
    );
  };

  const onUserConfirmEdit = async () => {
    if (validateEditData()) {
      try {
        const updatedUser = {
          firstName: firstNameValue,
          lastName: lastNameValue,
          aboutMe: aboutMeValue,
          address: addressValue,
          email: emailValue,
          contact: phoneNumberValue,
        };
        await updateUserProfile(updatedUser);
        await updateJobSeekerUsername(userNameValue, password);
        notifySuccess("Profile updated successfully");
        // Optionally, refetch user data here
        refetchjobseeker();
      } catch (error) {
        notifyError(error as string);
      }
    }
  };

  const onUserConfirmEditUsername = async () => {
    if (password !== confirmpassword) {
      notifyError("Passwords do not match");
      return;
    }
    try {
      const response = await updateJobSeekerUsername(userNameValue, password);
      console.log("response:", response);
      // if (response.data.error) {
      //   notifyError(response.data.error);
      //   return;
      // }
      notifySuccess("username updated successfully");

      refetchjobseeker();
      console.log("refetchjobseeker");
    } catch (error) {
      if (error instanceof AxiosError) {
        notifyError((error as AxiosError).response.data.msg);
      } else {
        notifyError(error as string);
      }
    }
  };

  const onUserConfirmEditPassword = async () => {
    if (password2 !== confirmpassword2) {
      notifyError("Passwords do not match");
      return;
    }
    try {
      await updateJobSeekerPassword(newPassword, password2);
      notifySuccess("Passwords updated successfully");

      refetchjobseeker();
      console.log("refetchjobseeker");
    } catch (error) {
      if (error instanceof AxiosError) {
        notifyError((error as AxiosError).response.data.msg);
      } else {
        notifyError(error as string);
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteJobFindingPost(postId);
      setUserPosts(userPosts.filter((post) => post.id !== postId));
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  return (
    <div>
      <ToastContainer />
      <Navbar
        user={user}
        isLoading={isLoading}
        isHaveUser={isHaveUser}
        refetchjobseeker={refetchjobseeker}
        refetchemployer={refetchemployer}
        refetchCompany={refetchCompany}
        isStale={isStale}
        setUser={setUser}
      />

      {user?.type === "JOBSEEKER" ? (
        <header className="bg-gradient-to-r from-seagreen to-teal-200 h-40 w-full relative"></header>
      ) : (
        <header className="bg-gradient-to-r from-seagreen to-amber-200 h-40 w-full relative"></header>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6 -mt-20 flex flex-col md:flex-row items-center md:items-start">
            <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white shadow-md">
              <img
                src={
                  user.profilePicture !== "UNDEFINED"
                    ? user.profilePicture
                    : "พิการ.jpg"
                }
                alt="Profile photo"
                className="object-cover w-full h-full"
              />

              <div
                className="absolute top-7 left-[202px] rounded-3xl p-[6px] z-10 cursor-pointer"
                onClick={profileDropzoneToggle}
              >
                <div className="absolute text-base rounded-3xl p-[6px] z-10">
                  <span className="absolute left-0 top-0 w-full h-full bg-white rounded-3xl opacity-70"></span>
                  <RiPencilFill className="opacity-0" />
                </div>

                <div className="absolute text-lg rounded-3xl p-[6px] z-30">
                  <RiPencilFill />
                </div>
              </div>
            </div>

            <Modal
              opened={profileDropzoneOpened}
              onClose={profileDropzoneClose}
              title=""
            >
              {user ? (
                user.type === "EMPLOYER" ? (
                  <ImageDropzoneButton
                    userId={user.id}
                    bucketName={"employer"}
                    prefixPath={"profile"}
                  />
                ) : (
                  <ImageDropzoneButton
                    userId={user.id}
                    bucketName={"job-seeker"}
                    prefixPath={"profile"}
                  />
                )
              ) : (
                <p>Loading...</p>
              )}
            </Modal>

            <div className="mt-4 md:mt-0 md:ml-6 md:mr-3 flex-1">
              <div
                className={`
                    flex items-center rounded-lg
                    ${style["jobseeker-name-container"]}
                  `}
              >
                <h1 className="text-xl md:text-2xl font-semibold mr-2 pl-3">
                  {user.firstName} {user.lastName}
                </h1>

                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  ({user.aboutMe})
                </p>
              </div>

              <div className="relative mt-3 ml-1">
                <div
                  className={`
                    flex items-center text-sm md:text-base font-semibold
                    ${
                      user.type === "JOBSEEKER"
                        ? "text-green-500"
                        : "text-amber-400"
                    }
                  `}
                >
                  <span className="mr-[6px] -ml-[2px] pt-[1px] text-xl">
                    <MdWorkspacePremium />
                  </span>
                  : {user.type}
                </div>

                <div className="flex items-center text-sm md:text-base mt-2 text-gray-700">
                  <span className="mr-2">
                    <FaAddressBook color="#4a5568" />
                  </span>
                  : {user.address}
                </div>

                <div className="flex items-center text-sm md:text-base mt-2 text-gray-700">
                  <span className="mr-2 pt-[1px]">
                    <SiGmail color="#4a5568" />
                  </span>
                  : {user.email}
                </div>

                <div className="flex items-center text-sm md:text-base mt-2 text-gray-700">
                  <span className="mr-2">
                    <FaPhoneAlt color="#4a5568" />
                  </span>
                  : {user.contact}
                </div>
              </div>
            </div>

            <div className="h-48">
              <div className="mt-6 md:mt-0 md:ml-auto grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-lg font-semibold">2,985</p>
                  <div className="flex justify-center text-sm font-medium text-orange-400">
                    <span className="pt-[1px] mr-1 text-lg">
                      <MdWork />
                    </span>
                    Work
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">132</p>
                  <div className="flex justify-center text-sm font-medium text-blue-400">
                    <span className="pt-[1px] mr-1 text-lg">
                      <RiUserFollowFill />
                    </span>
                    Following
                  </div>
                </div>
                <div>
                  <p className="text-lg font-semibold">548</p>
                  <div className="flex justify-center text-sm font-medium text-pink-400">
                    <span className="pt-[1px] mr-1 text-lg">
                      <FaHeart />
                    </span>
                    Likes
                  </div>
                </div>
              </div>

              <div className="mt-28 w-full flex justify-end">
                <button
                  className="text-base bg-gray-600 text-white px-3 py-1 rounded-md hover:bg-gray-500 transition"
                  onClick={editProfileToggle}
                >
                  Edit
                </button>
              </div>

              <Modal
                opened={editProfileOpened}
                onClose={editProfileClose}
                title="Edit Profile"
                styles={{
                  title: {
                    fontWeight: "bold",
                  },
                }}
              >
                <TextInput
                  mt="md"
                  label="username"
                  placeholder="your username"
                  required
                  inputWrapperOrder={["label", "input", "error"]}
                  value={userNameValue}
                  onChange={(event) => setuserNameValue(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="password"
                  placeholder="password for changing username"
                  required
                  inputWrapperOrder={["label", "input", "error"]}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="confirmpassword"
                  placeholder="confirm your password"
                  required
                  inputWrapperOrder={["label", "input", "error"]}
                  value={confirmpassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
                <button
                  className="text-base bg-green-600 text-white px-3 py-1 rounded-sm hover:bg-green-500 transition"
                  onClick={onUserConfirmEditUsername}
                >
                  update username
                </button>

                <TextInput
                  mt="md"
                  label="new password"
                  placeholder="your new password"
                  required
                  inputWrapperOrder={["label", "input", "error"]}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="old password"
                  placeholder="password for changing username"
                  required
                  inputWrapperOrder={["label", "input", "error"]}
                  value={password2}
                  onChange={(event) => setPassword2(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="confirm old password"
                  placeholder="confirm your old password"
                  required
                  inputWrapperOrder={["label", "input", "error"]}
                  value={confirmpassword2}
                  onChange={(event) => setConfirmPassword2(event.target.value)}
                />
                <button
                  className="text-base bg-green-600 text-white px-3 py-1 rounded-sm hover:bg-green-500 transition"
                  onClick={onUserConfirmEditPassword}
                >
                  update password
                </button>

                <TextInput
                  mt="md"
                  label="First Name"
                  placeholder="your first name"
                  required
                  error={firstNameError}
                  inputWrapperOrder={["label", "input", "error"]}
                  value={firstNameValue}
                  onChange={(event) => setFirstNameValue(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="Last Name"
                  placeholder="your last name"
                  required
                  error={lastNameError}
                  inputWrapperOrder={["label", "input", "error"]}
                  value={lastNameValue}
                  onChange={(event) => setLastNameValue(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="About Me"
                  placeholder="your about me"
                  error={aboutMeError}
                  inputWrapperOrder={["label", "input", "error"]}
                  value={aboutMeValue}
                  onChange={(event) => setAboutMeValue(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="Address"
                  placeholder="your address"
                  required
                  error={addressError}
                  inputWrapperOrder={["label", "input", "error"]}
                  value={addressValue}
                  onChange={(event) => setAddressValue(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="Email"
                  placeholder="your email"
                  required
                  error={""}
                  inputWrapperOrder={["label", "input", "error"]}
                  value={emailValue}
                  onChange={(event) => setEmailValue(event.target.value)}
                />

                <TextInput
                  mt="md"
                  label="Contact"
                  placeholder="your Contact"
                  required
                  error={""}
                  inputWrapperOrder={["label", "input", "error"]}
                  value={phoneNumberValue}
                  onChange={(event) => setPhoneNumberValue(event.target.value)}
                />

                <div className="mt-6 w-full flex justify-end">
                  <button
                    className="text-base bg-green-600 text-white px-3 py-1 rounded-sm hover:bg-green-500 transition"
                    onClick={onUserConfirmEdit}
                  >
                    Confirm
                  </button>

                  <button
                    className="text-base bg-gray-500 text-white px-3 py-1 ml-2 rounded-sm hover:bg-gray-400 transition"
                    onClick={editProfileToggle}
                  >
                    Cancel
                  </button>
                </div>
              </Modal>
            </div>
          </div>

          {user.type === "JOBSEEKER" && (
            <p className="mt-8 text-xl font-semibold">
              Skills{" "}
              <span className="text-base text-gray-500 font-normal">
                {user.skills.length}
              </span>
            </p>
          )}

          {user.type === "JOBSEEKER" && (
            <section className="max-w-6xl mt-4">
              <div className="grid md:grid-cols-3 gap-6">
                {user.skills.map((skill: any) => {
                  return (
                    <div className="inline-block h-[240px] lg:h-[224px]">
                      <SkillCardGradient
                        title={skill.toSkill.name}
                        content={skill.toSkill.description}
                      />
                    </div>
                  );
                })}

                <div
                  className="inline-block h-[240px] lg:h-[224px]"
                  onClick={() => {}}
                >
                  <SkillCardGradient
                    title={"Add Skill"}
                    content={"Add more your skills, click here!"}
                    isAddNewSkill
                  />
                </div>
              </div>
            </section>
          )}

          {/* Add Quick Action Buttons */}
          <div className="bg-white rounded-lg shadow-md p-4 mt-6 flex justify-center space-x-4">
            <Link
              to="/my-posts"
              className="flex-1 bg-seagreen/80 text-white px-4 py-3 rounded-lg hover:bg-seagreen transition text-center font-medium"
            >
              <div className="flex justify-center items-center">
                <span className="mr-2 text-xl">
                  <BsPostcardHeart />
                </span>{" "}
                โพสต์งานของฉัน
              </div>
            </Link>
            <Link
              to="/find"
              className="flex-1 bg-seagreen/80 text-white px-4 py-3 rounded-lg hover:bg-seagreen transition text-center font-medium"
            >
              <div className="flex justify-center items-center">
                <span className="mr-2 text-xl">
                  <AiOutlineFileSearch />
                </span>{" "}
                ค้นหางาน
              </div>
            </Link>
            <Link
              to="/trackjobseeker"
              className="flex-1 bg-seagreen/80 text-white px-4 py-3 rounded-lg hover:bg-seagreen transition text-center font-medium"
            >
              <div className="flex justify-center items-center">
                <span className="mr-2 text-xl">
                  <MdAutoGraph />
                </span>{" "}
                ติดตามงาน
              </div>
            </Link>
          </div>

          <div className="mt-8 flex items-center space-x-4 border-b border-gray-200 pb-2">
            <button
              className={
                baseTabClasses +
                " " +
                (activeTab === "work" ? activeClasses : inactiveClasses)
              }
              onClick={() => handleTabClick("work")}
            >
              My Post <span className="text-sm text-gray-500">54</span>
            </button>
            <button
              className={
                baseTabClasses +
                " " +
                (activeTab === "about" ? activeClasses : inactiveClasses)
              }
              onClick={() => handleTabClick("about")}
            >
              About
            </button>
          </div>
        </section>

        <div className="mb-8">
          {activeTab === "work" && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                {userPosts.map((post) => (
                  <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <p className="text-gray-700 mt-2">{post.description}</p>
                    <p className="text-gray-700 mt-2">
                      Location: {post.jobLocation}
                    </p>
                    <p className="text-gray-700 mt-2">
                      Expected Salary: {post.expectedSalary}
                    </p>
                    <p className="text-gray-700 mt-2">
                      Work Dates: {post.workDates}
                    </p>
                    <p className="text-gray-700 mt-2">
                      Work Hours: {post.workHoursRange}
                    </p>
                    <p className="text-gray-700 mt-2">Status: {post.status}</p>
                    <p className="text-gray-700 mt-2">
                      Job Type: {post.jobPostType}
                    </p>
                    <p className="text-gray-700 mt-2">
                      Job Seeker Type: {post.jobSeekerType}
                    </p>
                    <p className="text-gray-700 mt-2">
                      Created At: {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <p className="text-gray-700 mt-2">
                      Updated At: {new Date(post.updatedAt).toLocaleString()}
                    </p>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">Skills</h3>
                      <ul className="list-disc list-inside">
                        {post.skills.map((skill: any) => (
                          <li key={skill.id}>
                            {skill.name}: {skill.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold">Job Categories</h3>
                      <ul className="list-disc list-inside">
                        {post.jobCategories.map((category: any) => (
                          <li key={category.id}>
                            {category.name}: {category.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <button
                      className="flex-1 bg-seagreen/80 hover:bg-seagreen text-white px-4 py-2 text-sm rounded-lg shadow-md transition"
                      onClick={() =>
                        navigate(`/jobseeker/viewpost/${String(post.id)}`, {
                          state: { post },
                        })
                      }
                    >
                      view detail
                    </button>
                    <button
                      className="text-base bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-500 transition mt-4"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "about" && (
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              <div className="grid md:grid-cols-3 gap-6">
                <ArticleCard
                  url={""}
                  badgeList={["TODO", "Somthing", "Here"]}
                  title={"About"}
                  description={
                    " Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores assumenda omnis sequi eveniet debitis autem at, a iure non beatae molestiae nobis in unde delectus quis reiciendis. Dicta, quidem deleniti!"
                  }
                  profileImage={"พิการ.jpg"}
                  postOwner={"พิการ คุง"}
                  postedTime={"3 minutes ago"}
                  liked={14}
                />
              </div>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Profile;
