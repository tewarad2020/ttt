import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ClipLoader } from "react-spinners"; // You can use any spinner library
import {
  fetchAdminInfo,
  generateAdmin,
  fetchApprovalRequests,
  loginAdmin,
  logoutAdmin,
  approveUser,
} from "../api/Admin";
import {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from "../api/Skills";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/JobCategories";
import { getAdminMatchingStatus } from "../api/Matching";

interface ApprovalRequest {
  id: string;
  userId: string;
  userType: string;
  status: string;
  adminId: string;
}

const Admin: React.FC = () => {
  const queryClient = useQueryClient();
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const [skills, setSkills] = useState<any[]>([]);
  const [jobCategories, setJobCategories] = useState<any[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", description: "" });
  const [newCategory, setNewCategory] = useState({ name: "", description: "" });

  const fetchSkills = async () => {
    try {
      const response = await getAllSkills();
      setSkills(response.data);
    } catch (error) {
      console.error("Failed to fetch skills:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      setJobCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleCreateSkill = async () => {
    try {
      await createSkill(newSkill);
      fetchSkills();
      setNewSkill({ name: "", description: "" });
    } catch (error) {
      console.error("Failed to create skill:", error);
    }
  };

  const handleCreateCategory = async () => {
    try {
      await createCategory(newCategory);
      fetchCategories();
      setNewCategory({ name: "", description: "" });
    } catch (error) {
      console.error("Failed to create category:", error);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      await deleteSkill(id);
      fetchSkills();
    } catch (error) {
      console.error("Failed to delete skill:", error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      fetchCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const storedAdminInfo = localStorage.getItem("adminInfo");

    if (storedIsLoggedIn === "true" && storedAdminInfo) {
      setIsLoggedIn(true);
      fetchSkills();
      fetchCategories();
      queryClient.setQueryData("adminInfo", JSON.parse(storedAdminInfo));
    }
  }, [queryClient]);

  const { data: Allmatching, isLoading: AllmatchingLoading } = useQuery(
    "Allmatching",
    getAdminMatchingStatus,
    {
      enabled: isLoggedIn,
    }
  );

  const { data: adminInfo, isLoading: adminLoading } = useQuery(
    "adminInfo",
    fetchAdminInfo,
    { enabled: isLoggedIn }
  );
  const { data: approvalRequests = [], isLoading: approvalLoading } = useQuery(
    "approvalRequests",
    fetchApprovalRequests,
    {
      enabled: isLoggedIn,
    }
  );
  const generateAdminMutation = useMutation(generateAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries("adminInfo");
    },
  });

  const loginAdminMutation = useMutation(
    ({ name, password }: { name: string; password: string }) =>
      loginAdmin(name, password),
    {
      onSuccess: (data) => {
        queryClient.setQueryData("adminInfo", data);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("adminInfo", JSON.stringify(data));
      },
    }
  );
  const logoutAdminMutation = useMutation(logoutAdmin, {
    onSuccess: () => {
      queryClient.invalidateQueries("adminInfo");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("adminInfo");
      queryClient.setQueryData("adminInfo", null);
    },
  });
  const approveUserMutation = useMutation(
    ({ userId, status }: { userId: string; status: string }) =>
      approveUser(userId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("approvalRequests");
      },
    }
  );

  const handleGenerateAdmin = () => {
    generateAdminMutation.mutate();
  };

  const handleAdminLogin = (name: string, password: string) => {
    setLoginLoading(true);
    loginAdminMutation.mutate(
      { name, password },
      {
        onSuccess: () => {
          setIsLoggedIn(true);
        },
        onSettled: () => {
          setLoginLoading(false);
        },
      }
    );
  };

  const handleAdminLogout = () => {
    setLogoutLoading(true);
    logoutAdminMutation.mutate(undefined, {
      onSuccess: () => {
        setIsLoggedIn(false);
      },
      onSettled: () => {
        setLogoutLoading(false);
      },
    });
  };

  const handleApproveUser = (userId: string, status: string) => {
    approveUserMutation.mutate({ userId, status });
  };

  return (
    <div className="relative p-6 bg-gray-100 min-h-screen">
      {(adminLoading || approvalLoading) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <ClipLoader color="#ffffff" size={50} />
        </div>
      )}

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Generate Admin</h2>
        <button
          onClick={handleGenerateAdmin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={generateAdminMutation.isLoading}
        >
          {generateAdminMutation.isLoading ? (
            <ClipLoader color="#ffffff" size={20} />
          ) : (
            "Generate Admin"
          )}
        </button>
      </div>

      <div className="mb-6 p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Admin Login</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const username = formData.get("username") as string;
            const password = formData.get("password") as string;
            handleAdminLogin(username, password);
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              className="mt-1 p-2 w-full border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            disabled={loginLoading}
          >
            {loginLoading ? <ClipLoader color="#ffffff" size={20} /> : "Login"}
          </button>
        </form>
        <button
          type="submit"
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-green-600"
          disabled={logoutLoading}
          onClick={handleAdminLogout}
        >
          {logoutLoading ? <ClipLoader color="#ffffff" size={20} /> : "Logout"}
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {adminInfo && (
        <div className="mb-6 p-4 bg-white rounded shadow">
          <h2 className="text-2xl font-semibold">
            Welcome, {adminInfo.username}
          </h2>
          <p className="text-gray-600">ID: {adminInfo.id}</p>
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4">
        Registration Approval Requests
      </h2>
      {adminInfo ? (
        <>
          {Array.isArray(approvalRequests) ? (
            <ul className="space-y-4">
              {approvalRequests.map((request: ApprovalRequest) => (
                <li key={request.id} className="p-4 bg-white rounded shadow">
                  <span className="font-medium">{request.userId}</span> -{" "}
                  <span className="text-gray-600">{request.userType}</span> -{" "}
                  <span className="text-gray-600">{request.status}</span>
                  <button
                    onClick={() => handleApproveUser(request.id, "APPROVED")}
                    className="ml-4 px-2 py-1 bg-green-500 text-white rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproveUser(request.id, "UNAPPROVED")}
                    className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Unapprove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No approval requests found.</p>
          )}
          <div className="mb-6 p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <ul className="space-y-2">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded"
                >
                  <span>
                    {skill.name} - {skill.description}
                  </span>
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold mt-4">Add New Skill</h3>
            <div className="flex space-x-2 mt-2">
              <input
                type="text"
                placeholder="Name"
                value={newSkill.name}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, name: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Description"
                value={newSkill.description}
                onChange={(e) =>
                  setNewSkill({ ...newSkill, description: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <button
                onClick={handleCreateSkill}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Skill
              </button>
            </div>
          </div>
          <div className="mb-6 p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Job Categories</h2>
            <ul className="space-y-2">
              {jobCategories.map((category) => (
                <li
                  key={category.id}
                  className="flex justify-between items-center p-2 bg-gray-100 rounded"
                >
                  <span>
                    {category.name} - {category.description}
                  </span>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
            <h3 className="text-xl font-semibold mt-4">Add New Category</h3>
            <div className="flex space-x-2 mt-2">
              <input
                type="text"
                placeholder="Name"
                value={newCategory.name}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                className="p-2 border rounded w-full"
              />
              <input
                type="text"
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    description: e.target.value,
                  })
                }
                className="p-2 border rounded w-full"
              />
              <button
                onClick={handleCreateCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Category
              </button>
            </div>

            <h3 className="text-xl font-semibold mt-4">All Matching Status</h3>
          </div>
          {AllmatchingLoading ? (
            <ClipLoader color="#ffffff" size={50} />
          ) : (
            <ul className="space-y-4">
              {Allmatching?.data?.findingMatches.map((status: any) => (
                <li key={status.id} className="p-4 bg-gray-100 rounded">
                  <span className="font-medium">{status.id}</span> -{" "}
                  <span className="text-gray-600">{status.status}</span> -{" "}
                  <span className="text-gray-600">{status.createdAt}</span>
                  <div className="mt-2">
                    <h4 className="font-semibold">Job Finding Post</h4>
                    <p>Title: {status.toPost.title}</p>
                    <p>Description: {status.toPost.description}</p>
                    <p>Location: {status.toPost.jobLocation}</p>
                    <p>Expected Salary: {status.toPost.expectedSalary}</p>
                  </div>
                </li>
              ))}
              {Allmatching?.data?.hiringMatches.map((status: any) => (
                <li key={status.id} className="p-4 bg-gray-100 rounded">
                  <span className="font-medium">{status.id}</span> -{" "}
                  <span className="text-gray-600">{status.status}</span> -{" "}
                  <span className="text-gray-600">{status.createdAt}</span>
                  <div className="mt-2">
                    <h4 className="font-semibold">Job Hiring Post</h4>
                    <p>Title: {status.toPost.title}</p>
                    <p>Description: {status.toPost.description}</p>
                    <p>Location: {status.toPost.jobLocation}</p>
                    <p>Salary: {status.toPost.salary}</p>
                  </div>
                  <div className="mt-2">
                    <h4 className="font-semibold">Matched Seekers</h4>
                    <ul className="space-y-2">
                      {status.toMatchSeekers.map((seeker: any) => (
                        <li key={seeker.jobSeekerId || seeker.oauthJobSeekerId}>
                          <p>
                            Seeker ID:{" "}
                            {seeker.jobSeekerId || seeker.oauthJobSeekerId}
                          </p>
                          <p>Status: {seeker.status}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <p className="text-gray-600">
          Please log in to view approval requests current skill and jobCategory.
        </p>
      )}
    </div>
  );
};

export default Admin;
