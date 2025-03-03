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
import { useForm, UseFormReturnType } from "@mantine/form";

import {
  TextInput,
  Title,
  Grid,
  Stack,
  Select,
  Switch,
  Checkbox,
} from "@mantine/core";

interface InputProps {
  label: string;
  placeholder: string;
  inputProps: ReturnType<UseFormReturnType<any>["getInputProps"]>;
  size: "short" | "medium" | "long";
  required?: boolean
}

// Interface สำหรับ Select Props
interface SelectProps {
  monthProp: ReturnType<UseFormReturnType<any>["getInputProps"]>;
  yearProp: ReturnType<UseFormReturnType<any>["getInputProps"]>;
  disabled?: boolean;
}

const jobCategories = [
  { value: "it", label: "เทคโนโลยีสารสนเทศ (IT)" },
  { value: "finance", label: "การเงินและการธนาคาร" },
  { value: "marketing", label: "การตลาด" },
  { value: "engineering", label: "วิศวกรรม" },
  { value: "healthcare", label: "สุขภาพและการแพทย์" },
  { value: "education", label: "การศึกษา" },
  { value: "design", label: "ออกแบบและครีเอทีฟ" },
  { value: "hr", label: "ทรัพยากรบุคคล (HR)" },
  { value: "sales", label: "ฝ่ายขาย" },
  { value: "logistics", label: "โลจิสติกส์และซัพพลายเชน" },
];

// ข้อมูลสายงานย่อย (ขึ้นอยู่กับประเภทงานที่เลือก)
const subCategories = {
  it: [
    { value: "software_engineer", label: "วิศวกรซอฟต์แวร์" },
    { value: "data_scientist", label: "นักวิทยาศาสตร์ข้อมูล" },
    { value: "network_engineer", label: "วิศวกรเครือข่าย" },
    { value: "cybersecurity", label: "ความปลอดภัยทางไซเบอร์" },
    { value: "web_developer", label: "นักพัฒนเว็บ" },
  ],
  finance: [
    { value: "accountant", label: "นักบัญชี" },
    { value: "financial_analyst", label: "นักวิเคราะห์การเงิน" },
    { value: "investment_banker", label: "นักการธนาคารการลงทุน" },
    { value: "auditor", label: "ผู้ตรวจสอบบัญชี" },
    { value: "tax_consultant", label: "ที่ปรึกษาด้านภาษี" },
  ],
  marketing: [
    { value: "digital_marketing", label: "การตลาดดิจิทัล" },
    { value: "brand_manager", label: "ผู้จัดการแบรนด์" },
    { value: "content_marketing", label: "การตลาดเนื้อหา" },
    { value: "social_media_manager", label: "ผู้จัดการโซเชียลมีเดีย" },
    { value: "seo_specialist", label: "ผู้เชี่ยวชาญ SEO" },
  ],
  engineering: [
    { value: "civil_engineer", label: "วิศวกรโยธา" },
    { value: "mechanical_engineer", label: "วิศวกรเครื่องกล" },
    { value: "electrical_engineer", label: "วิศวกรไฟฟ้า" },
    { value: "chemical_engineer", label: "วิศวกรเคมี" },
    { value: "aerospace_engineer", label: "วิศวกรอากาศยาน" },
  ],
  healthcare: [
    { value: "doctor", label: "แพทย์" },
    { value: "nurse", label: "พยาบาล" },
    { value: "pharmacist", label: "เภสัชกร" },
    { value: "physiotherapist", label: "นักกายภาพบำบัด" },
    { value: "medical_researcher", label: "นักวิจัยทางการแพทย์" },
  ],
  education: [
    { value: "teacher", label: "ครู" },
    { value: "professor", label: "อาจารย์มหาวิทยาลัย" },
    { value: "education_consultant", label: "ที่ปรึกษาด้านการศึกษา" },
    { value: "curriculum_designer", label: "ผู้ออกแบบหลักสูตร" },
    { value: "tutor", label: "ติวเตอร์" },
  ],
  design: [
    { value: "graphic_designer", label: "นักออกแบบกราฟิก" },
    { value: "ui_ux_designer", label: "นักออกแบบ UI/UX" },
    { value: "interior_designer", label: "นักออกแบบภายใน" },
    { value: "fashion_designer", label: "นักออกแบบแฟชั่น" },
    { value: "motion_designer", label: "นักออกแบบโมชั่นกราฟิก" },
  ],
  hr: [
    { value: "recruiter", label: "นักสรรหาบุคลากร" },
    { value: "hr_manager", label: "ผู้จัดการฝ่ายทรัพยากรบุคคล" },
    { value: "training_specialist", label: "ผู้เชี่ยวชาญฝึกอบรม" },
    { value: "compensation_analyst", label: "นักวิเคราะห์ค่าตอบแทน" },
    { value: "hr_consultant", label: "ที่ปรึกษาทรัพยากรบุคคล" },
  ],
  sales: [
    { value: "sales_executive", label: "พนักงานฝ่ายขาย" },
    { value: "account_manager", label: "ผู้จัดการบัญชี" },
    { value: "business_development", label: "พัฒนาธุรกิจ" },
    { value: "sales_engineer", label: "วิศวกรฝ่ายขาย" },
    { value: "retail_sales", label: "ฝ่ายขายปลีก" },
  ],
  logistics: [
    { value: "supply_chain_manager", label: "ผู้จัดการซัพพลายเชน" },
    { value: "logistics_coordinator", label: "ผู้ประสานงานโลจิสติกส์" },
    { value: "warehouse_manager", label: "ผู้จัดการคลังสินค้า" },
    { value: "transportation_manager", label: "ผู้จัดการการขนส่ง" },
    { value: "procurement_specialist", label: "ผู้เชี่ยวชาญจัดซื้อ" },
  ],
};

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 20 }, (_, i) => (currentYear - i).toString()); 

function Profile() {
  const navigate = useNavigate();
  // Helper function for toast messages
  const notifyError = (message: string) =>
    toast.error(message, { position: "top-center" });
  const notifySuccess = (message: string) =>
    toast.success(message, { position: "top-center" });

  const form = useForm({
    initialValues: {
      username: "",
      firstName: "",
      lastName: "",
      location: "",
      aboutMe: "",
      email: "",
      contact: "",
      jobTitle: "",
      company: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentlyWorking: false,
      categorieWork: "",
      subCategorieWork: "",
    },

    validate: {
      startMonth: (value) => (value ? null : "Please select a start month"),
      startYear: (value) => (value ? null : "Please select an end month"),
      endMonth: (value, values) => values.currentlyWorking ? null : value ? null : "Please select a end month",
      endYear: (value, values) => values.currentlyWorking ? null : value ? null : "Please select a end year",
      categorieWork: (value) => (value ? null : "Please select a job category"),
      subCategorieWork: (value) => (value ? null : "Please select a subcategory"),
    },
  });

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
  const [
    confirmPasswordOpened,
    { toggle: confirmPasswordToggle, close: confirmPasswordClose },
  ] = useDisclosure(false);
  // const [firstNameValue, setFirstNameValue] = useState<string>("");
  // const [lastNameValue, setLastNameValue] = useState<string>("");
  // const [aboutMeValue, setAboutMeValue] = useState<string>("");
  // const [addressValue, setAddressValue] = useState<string>("");
  // const [emailValue, setEmailValue] = useState<string>("");
  // const [phoneNumberValue, setPhoneNumberValue] = useState<string>("");
  const [userPosts, setUserPosts] = useState<any[]>([]);
  // const [userNameValue, setuserNameValue] = useState<string>("");
  // const [password, setPassword] = useState<string>("");
  // const [confirmpassword, setConfirmPassword] = useState<string>("");
  const [hasExperience, setHasExperience] = useState<boolean>(true);
  const [hasDesiredJobCategory, setHasDesiredJobCategory] = useState<boolean>(true);

  // const [newPassword, setNewPassword] = useState<string>("");
  // const [password2, setPassword2] = useState<string>("");
  const [confirmPassword2, setConfirmPassword2] = useState<string>("");
  const [confirmPassword2Error, setConfirmPassword2Error] = useState<string>("");

  useEffect(() => {
    const fetchUserPost = async () => {
      try {
        const response = await getUserJobFindingPosts();
        setUserPosts(response.data.jobPosts);
      } catch (error) {}
    };
    fetchUserPost();

    setHasExperience(true)
    setHasDesiredJobCategory(true)

    form.setValues({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.address,
      aboutMe: user.aboutMe,
      email: user.email,
      contact: user.contact,
      jobTitle: "",
      company: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentlyWorking: false,
      categorieWork: "",
      subCategorieWork: "",
    })

  }, [editProfileOpened]);

  const validateEditData = () => {
    // username validation
    if (form.values.username == "") {
      notifyError("Please enter your username");
      return false
    }

    // first name validation
    if (form.values.firstName == "") {
      notifyError("Please enter your first name");
      return false
    }

    // last name validation
    if (form.values.lastName == "") {
      notifyError("Please enter your last name");
      return false
    }

    // address validation
    if (form.values.location == "") {
      notifyError("Please enter your address");
      return false
    }

    // about me validation
    if (form.values.aboutMe == "") {
      notifyError("Please enter your about me");
      return false
    }

    // email validation
    if (form.values.email == "") {
      notifyError("Please enter your email");
      return false
    }

    // contact validation
    if (form.values.contact == "") {
      notifyError("Please enter your contact");
      return false
    }

    // experience validation
    if (hasExperience) { 
      if (form.values.jobTitle == "") {
        notifyError("Please enter your job title");
        return false
      }

      if (form.values.company == "") {
        notifyError("Please enter your company");
        return false
      }

      if (form.values.startMonth == "") {
        notifyError("Please choose your start month");
        return false
      }

      if (form.values.startYear == "") {
        notifyError("Please choose your start year");
        return false
      }

      if (!form.values.currentlyWorking) {
        if (form.values.endMonth == "") {
          notifyError("Please choose your end month");
          return false
        }

        if (form.values.endYear == "") {
          notifyError("Please choose your end year");
          return false
        }
      }
    }

    // job category validation
    if (hasDesiredJobCategory) {
      if (form.values.categorieWork == "") {
        notifyError("Please choose your category of work");
        return false
      } else {
        if (form.values.endYear == "") {
          notifyError("Please choose your sub category of work");
          return false
        }
      }
    }

    return true
  };

  const onUserConfirmEdit = async () => {
    if (validateEditData()) {
      confirmPasswordToggle()
      setConfirmPassword2("")
    }
  };

  useEffect(() => {
    setConfirmPassword2("")
  }, [confirmPasswordOpened])

  const onUserConfirmByPassword = async () => {
    if (confirmPassword2 === '') {
      setConfirmPassword2Error("Please enter your password")
      notifyError("Please enter your password");
      return
    }

    try {
      const updatedUser = {
        firstName: form.values.firstName,
        lastName: form.values.lastName,
        aboutMe: form.values.aboutMe,
        address: form.values.location,
        email: form.values.email,
        contact: form.values.contact,
      };
      // await updateUserProfile(updatedUser);
      // await updateJobSeekerUsername(form.values.username, confirmPassword2);
      notifySuccess("Profile updated successfully");
      // Optionally, refetch user data here
      // refetchjobseeker();
      confirmPasswordToggle()
      editProfileToggle()
    } catch (error) {
      notifyError(error as string);
    }
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log("Submitted values:", values);
  };

  // const onUserConfirmEditUsername = async () => {
  //   if (password !== confirmpassword) {
  //     notifyError("Passwords do not match");
  //     return;
  //   }
  //   try {
  //     const response = await updateJobSeekerUsername(userNameValue, password);
  //     console.log("response:", response);
  //     // if (response.data.error) {
  //     //   notifyError(response.data.error);
  //     //   return;
  //     // }
  //     notifySuccess("username updated successfully");

  //     refetchjobseeker();
  //     console.log("refetchjobseeker");
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       notifyError((error as AxiosError).response.data.msg);
  //     } else {
  //       notifyError(error as string);
  //     }
  //   }
  // };

  // const onUserConfirmEditPassword = async () => {
  //   if (password2 !== confirmpassword2) {
  //     notifyError("Passwords do not match");
  //     return;
  //   }
  //   try {
  //     await updateJobSeekerPassword(newPassword, password2);
  //     notifySuccess("Passwords updated successfully");

  //     refetchjobseeker();
  //     console.log("refetchjobseeker");
  //   } catch (error) {
  //     if (error instanceof AxiosError) {
  //       notifyError((error as AxiosError).response.data.msg);
  //     } else {
  //       notifyError(error as string);
  //     }
  //   }
  // };

  const handleDeletePost = async (postId: string) => {
    try {
      await deleteJobFindingPost(postId);
      setUserPosts(userPosts.filter((post) => post.id !== postId));
      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const renderTextInput = ({ label, placeholder, inputProps, size, required = false }: InputProps) => (
    <TextInput
      label={label}
      placeholder={placeholder}
      className="font-kanit"
      required={required}
      styles={{
        root: {
          width: size === "short" ? "100px" : size === "medium" ? "180px" : "400px",
          maxWidth: size === "short" ? "120px" : size === "medium" ? "200px" : "540px", 
        },
        label: { color: "#2d3748", fontWeight: 500 },
        input: {
          border: "1.5px solid #e2e8f0",
          padding: "0.4rem 0.6rem",
          borderRadius: "6px",
          "&:focus": { borderColor: "#2E8B57" },
        },
      }}
      {...inputProps}
    />
  );

  // ฟังก์ชันสร้าง Select (เดือนและปี) → ขนาดเท่ากันสำหรับ "ตั้งแต่" และ "ถึง"
  const renderDateGroup = ({ monthProp, yearProp, disabled = false }: SelectProps) => (
    <Grid grow className="w-full">
      <Grid.Col span={3}>
        <Select
          placeholder="เดือน"
          data={[
            "มกราคม",
            "กุมภาพันธ์",
            "มีนาคม",
            "เมษายน",
            "พฤษภาคม",
            "มิถุนายน",
            "กรกฎาคม",
            "สิงหาคม",
            "กันยายน",
            "ตุลาคม",
            "พฤศจิกายน",
            "ธันวาคม"
          ]}
          disabled={disabled}
          error={form.errors.categorieWork}
          className="w-full"
          styles={{
            input: {
              border: "1.5px solid #e2e8f0",
              padding: "0.4rem 0.5rem",
              borderRadius: "6px",
            },
          }}
          {...monthProp}
        />
      </Grid.Col>
      <Grid.Col span={3}>
        <Select
          placeholder="ปี"
          data={years}
          disabled={disabled}
          className="w-full"
          styles={{
            input: {
              border: "1.5px solid #e2e8f0",
              padding: "0.4rem 0.5rem",
              borderRadius: "6px",
            },
          }}
          {...yearProp}
        />
      </Grid.Col>
    </Grid>
  );

  const onUserSwitchHasExperience = (check: boolean) => {
    setHasExperience(check)
    form.setValues({
      jobTitle: "",
      company: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentlyWorking: false,
    })
  }

  const onUserSwitchJobCategory = (check: boolean) => {
    setHasDesiredJobCategory(check)
    form.setValues({
      categorieWork: "",
      subCategorieWork: "",
    })
  }

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
                size="lg"
                styles={{
                  title: {
                    fontWeight: "bold",
                  },
                }}
              >
                {/* <TextInput
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
                </button> */}

                {/* <TextInput
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
                </button> */}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                  <Stack gap="lg" mt="md">
                    {/* username (ยาวมากขึ้น) */}
                    <Grid grow>
                      <Grid.Col span={8}>
                        {renderTextInput({
                          label: "username",
                          placeholder: "กรอก username",
                          inputProps: form.getInputProps("username"),
                          size: "long",
                          required: true,
                        })}
                      </Grid.Col>
                    </Grid>

                    {/* ชื่อและนามสกุล (ขนาดกลาง) */}
                    <Grid grow>
                      <Grid.Col span={4}>
                        {renderTextInput({
                          label: "ชื่อ",
                          placeholder: "กรอกชื่อ",
                          inputProps: form.getInputProps("firstName"),
                          size: "medium",
                          required: true,
                        })}
                      </Grid.Col>
                      <Grid.Col span={8}>
                        {renderTextInput({
                          label: "นามสกุล",
                          placeholder: "กรอกนามสกุล",
                          inputProps: form.getInputProps("lastName"),
                          size: "medium",
                          required: true,
                        })}
                      </Grid.Col>
                    </Grid>
        
                    {/* ที่อยู่ปัจจุบัน (ยาวมากขึ้น) */}
                    <Grid grow>
                      <Grid.Col span={8}>
                        {renderTextInput({
                          label: "ที่อยู่ปัจจุบัน",
                          placeholder: "ระบุ เขต หรือ จังหวัด",
                          inputProps: form.getInputProps("location"),
                          size: "long",
                          required: true,
                        })}
                      </Grid.Col>
                    </Grid>

                    {/* เกี่ยวกับฉัน (ยาวมากขึ้น) */}
                    <Grid grow>
                      <Grid.Col span={8}>
                        {renderTextInput({
                          label: "เกี่ยวกับฉัน",
                          placeholder: "ระบุข้อความที่เกี่ยวกับตัวคุณ",
                          inputProps: form.getInputProps("aboutMe"),
                          size: "long",
                          required: true,
                        })}
                      </Grid.Col>
                    </Grid>

                    {/* อีเมล (ยาวมากขึ้น) */}
                    <Grid grow>
                      <Grid.Col span={8}>
                        {renderTextInput({
                          label: "อีเมล",
                          placeholder: "กรอกอีเมล",
                          inputProps: form.getInputProps("email"),
                          size: "long",
                          required: true,
                        })}
                      </Grid.Col>
                    </Grid>

                    {/* เบอร์โทร (ยาวมากขึ้น) */}
                    <Grid grow>
                      <Grid.Col span={8}>
                        {renderTextInput({
                          label: "เบอร์โทร",
                          placeholder: "กรอกเบอร์โทร",
                          inputProps: form.getInputProps("contact"),
                          size: "long",
                          required: true,
                        })}
                      </Grid.Col>
                    </Grid>
        
                    <div className="space-y-4 mt-6">
                      <Title order={4} className="text-gray-800 text-lg font-semibold">
                        ประสบการณ์ล่าสุด
                      </Title>
                      <Switch
                        label="ฉันมีประสบการณ์"
                        checked={hasExperience}
                        onChange={(e) => onUserSwitchHasExperience(e.currentTarget.checked)}
                        color="green"
                        classNames={{ label: "text-gray-700 font-kanit" }}
                      />
                    </div>
        
                    {hasExperience && (
                      <div className="space-y-4">
                        {/* ตำแหน่งงาน และ บริษัท (ยาวมากขึ้น) */}
                        {renderTextInput({
                          label: "ตำแหน่งงาน",
                          placeholder: "ระบุตำแหน่งงานของคุณ",
                          inputProps: form.getInputProps("jobTitle"),
                          size: "long",
                          required: true,
                        })}
                        {renderTextInput({
                          label: "บริษัท",
                          placeholder: "ชื่อบริษัท",
                          inputProps: form.getInputProps("company"),
                          size: "long",
                          required: true,
                        })}
        
                        <Grid grow>
                          <Grid.Col span={4}>
                            <label className="text-gray-700 font-kanit font-medium text-md">
                              ตั้งแต่
                              <span className="m_78a94662 mantine-InputWrapper-required mantine-TextInput-required font-normal" aria-hidden="true"> *</span>
                            </label>
                            {renderDateGroup({
                              monthProp: form.getInputProps("startMonth"),
                              yearProp: form.getInputProps("startYear")
                            })}
                          </Grid.Col>
                          <Grid.Col span={5} className="flex items-center">
                              </Grid.Col>
                        </Grid>
        
                        <Grid grow>
                          <Grid.Col>
                            <label className="text-gray-700 font-kanit font-medium text-md">
                              ถึง
                              <span className="m_78a94662 mantine-InputWrapper-required mantine-TextInput-required font-normal" aria-hidden="true"> *</span>
                            </label>
                            <Grid grow>
                              <Grid.Col span={4}>
                                {renderDateGroup({
                                  monthProp: form.getInputProps("endMonth"),
                                  yearProp: form.getInputProps("endYear"),
                                  disabled: form.values.currentlyWorking,
                                })}
                              </Grid.Col>
        
                              <Grid.Col span={5} className="flex items-center">
                                <Checkbox
                                  label="ยังอยู่ในตำแหน่งงานนี้"
                                  {...form.getInputProps("currentlyWorking", { type: "checkbox" })}
                                  color="green"
                                  classNames={{ label: "text-gray-700 font-kanit" }}
                                />
                              </Grid.Col>
                            </Grid>
                          </Grid.Col>
                        </Grid>
                      </div>
                    )}

                    <div className="space-y-4 mt-6">
                      <Title order={4} className="text-gray-800 text-lg font-semibold">
                        ประเภทงานที่ต้องการ
                      </Title>
                      <Switch
                        label="มีประเภทงานที่ต้องการ"
                        checked={hasDesiredJobCategory}
                        onChange={(e) => onUserSwitchJobCategory(e.currentTarget.checked)}
                        color="green"
                        classNames={{ label: "text-gray-700 font-kanit" }}
                      />
    
                      {hasDesiredJobCategory && (
                        <div className="space-y-4">
                          <Select
                            label="เลือกประเภทงานหลัก"
                            placeholder="เลือกประเภทงาน"
                            data={jobCategories}
                            className="font-kanit"
                            required
                            error={form.errors.categorieWork}
                            {...form.getInputProps("categorieWork")}
                            styles={{
                              input: {
                                border: "1.5px solid #e2e8f0",
                                padding: "0.4rem 0.6rem",
                                borderRadius: "6px",
                                "&:focus": { borderColor: "#2E8B57" },
                              },
                            }}
                          />
    
                          {form.values.categorieWork && (
                            <Select
                              label="เลือกสายงานย่อย"
                              placeholder="เลือกสายงาน"
                              data={subCategories[form.values.categorieWork as keyof typeof subCategories]}
                              className="font-kanit"
                              required
                              error={form.errors.categorieWork}
                              {...form.getInputProps("subCategorieWork")}
                              styles={{
                                input: {
                                  border: "1.5px solid #e2e8f0",
                                  padding: "0.4rem 0.6rem",
                                  borderRadius: "6px",
                                  "&:focus": { borderColor: "#2E8B57" },
                                },
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 w-full flex justify-end">
                      <button
                        type="submit"
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
                  </Stack>
                </form>
              </Modal>

              <Modal
                opened={confirmPasswordOpened}
                onClose={confirmPasswordClose}
                title="Confirm edit with your password"
              >
                <TextInput
                  type="password"
                  mt="md"
                  label="Password"
                  placeholder="your password"
                  required
                  inputWrapperOrder={["label", "input", "error"]}
                  error={confirmPassword2Error}
                  value={confirmPassword2}
                  autoComplete="new-password"
                  onChange={(event) => {
                    setConfirmPassword2(event.target.value)
                  }}
                />

                <div className="mt-6 w-full flex justify-end">
                  <button
                    className="text-base bg-green-600 text-white px-3 py-1 rounded-sm hover:bg-green-500 transition"
                    onClick={onUserConfirmByPassword}
                  >
                    Confirm
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
