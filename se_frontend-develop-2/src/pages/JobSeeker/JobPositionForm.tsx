import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import {
  TextInput,
  Slider,
  NumberInput,
  Button,
  Container,
  Paper,
  Title,
  Group,
  Stack,
  Modal,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { showNotification } from "@mantine/notifications";
import { Navbar } from "../../components/Navbar";
import { fetchAllVulnerabilities } from "../../api/Vulnerability";
import { useUser } from "../../context/UserContext";

const JobPositionForm = () => {
  const [submittedData, setSubmittedData] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [jobSeekerType, setJobSeekerType] = useState<string>("");

  interface Vulnerability {
    id: string;
    name: string;
  }
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

  useEffect(() => {
    const fetchVulnerabilities = async () => {
      try {
        const response = await fetchAllVulnerabilities();
        if (response.success) {
          if ("data" in response) {
            setVulnerabilities(response.data);
          }
        } else {
          console.error("Failed to fetch vulnerabilities:", response);
        }
      } catch (error) {
        console.error("Error fetching vulnerabilities:", error);
      }
    };

    fetchVulnerabilities();
  }, []);

  const form = useForm({
    initialValues: {
      jobLevel: "",
      expectedSalary: 30000, // Default salary
      experience: 2, // Default experience in years
      specialSkills: "",
      workRestrictions: "",
    },
    validate: {
      jobLevel: (value) =>
        value.trim().length > 0 ? null : "กรุณาระบุระดับตำแหน่งงานที่สนใจ",
      expectedSalary: (value) =>
        value && Number(value) > 0 ? null : "กรุณาระบุเงินเดือนที่คาดหวัง",
      experience: (value) =>
        value && Number(value) >= 0 ? null : "กรุณาระบุประสบการณ์ทำงาน",
      specialSkills: (value) =>
        value.trim().length > 0 ? null : "กรุณาระบุความสามารถพิเศษ",
      workRestrictions: (value) =>
        value.trim().length > 0 ? null : "กรุณาระบุข้อจำกัดในการทำงาน",
    },
  });

  const handleFileDrop = (files: File[]) => {
    const selectedFile = files[0];
    setFile(selectedFile);
    setFilePreview(URL.createObjectURL(selectedFile)); // Generate preview URL
  };

  const handleSubmit = (values: any) => {
    if (values.workRestrictions.trim() !== "ไม่มี" && !file) {
      showNotification({
        title: "ข้อผิดพลาด",
        message: "กรุณาแนบเอกสารยืนยันข้อมูล",
        color: "red",
      });
      return;
    }

    console.log("Form Submitted:", { ...values, file: file || null });
    setSubmittedData({ ...values, file: file || null }); // เก็บข้อมูลที่กรอกไว้ใน state
    setModalOpen(true); // เปิด Modal
  };

  const handleConfirm = () => {
    setModalOpen(false);
    showNotification({
      title: "สำเร็จ",
      message: "ข้อมูลถูกบันทึกเรียบร้อย",
      color: "teal",
    });
    console.log("Confirmed Data:", submittedData);
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      <Container size="sm" className="mt-8 kanit-regular">
        <Paper shadow="md" radius="md" p="xl" className="bg-white">
          <div
            
            className="kanit-bold text-2xl text-gray-800 mb-6 text-center kanit-light pb-8"
          >
            ระบุข้อมูลตำแหน่งงานที่สนใจ
          </div>

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                label="ระดับตำแหน่งงานที่ท่านสนใจ"
                placeholder="เช่น ผู้จัดการ, นักวิเคราะห์ ฯลฯ"
                required
                {...form.getInputProps("jobLevel")}
              />

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  เงินเดือนที่คาดหวัง (บาท)
                </label>
                <div className="px-10">
                  <Slider
                    value={form.values.expectedSalary}
                    onChange={(value) =>
                      form.setFieldValue("expectedSalary", value)
                    }
                    min={0}
                    max={100000}
                    step={5000}
                    marks={[
                      { value: 1000, label: "1k" },
                      { value: 5000, label: "5k" },
                      { value: 10000, label: "10k" },
                      { value: 20000, label: "20k" },
                      { value: 30000, label: "30k" },
                      { value: 40000, label: "40k" },
                      { value: 50000, label: "50k" },
                      { value: 75000, label: "75k" },
                      { value: 100000, label: "100k" },
                    ]}
                    className="mb-4"
                  />
                  <NumberInput
                    hideControls
                    value={form.values.expectedSalary}
                    onChange={(value) =>
                      form.setFieldValue("expectedSalary", Number(value) || 0)
                    }
                    min={15000}
                    max={100000}
                    step={5000}
                    className="mt-10"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  ประสบการณ์ทำงาน (ปี)
                </label>
                <div className="px-10 flex flex-row items-center justify-between gap-6">
                  <div className="flex-grow">
                    <Slider
                      value={form.values.experience}
                      onChange={(value) =>
                        form.setFieldValue("experience", value)
                      }
                      min={0}
                      max={10}
                      step={1}
                      marks={[
                        { value: 0, label: "0 ปี" },
                        { value: 1, label: "1 ปี" },
                        { value: 3, label: "3 ปี" },
                        { value: 5, label: "5 ปี" },
                        { value: 10, label: "10 ปี" },
                      ]}
                      className="mb-4"
                    />
                  </div>
                  <div className="w-24">
                    <NumberInput
                      hideControls
                      value={form.values.experience}
                      onChange={(value) => {
                        const clampedValue = Math.min(
                          Math.max(Number(value) || 0, 0),
                          10
                        );
                        form.setFieldValue("experience", clampedValue);
                      }}
                      min={0}
                      max={10}
                      step={1}
                    />
                  </div>
                </div>
              </div>

              <TextInput
                label="ความสามารถพิเศษ"
                placeholder="เช่น การเขียนโปรแกรม, การเจรจาต่อรอง ฯลฯ"
                required
                {...form.getInputProps("specialSkills")}
              />

              <TextInput
                label="ข้อจำกัดในการทำงาน"
                placeholder='เช่น พิการทางกายภาพ ฯลฯ ( หากไม่มี ให้ระบุว่า "ไม่มี" )'
                required
                {...form.getInputProps("workRestrictions")}
              />

              <div className="flex flex-col w-4/5 mx-auto">
                <label className="font-kanit text-gray-700">
                  ประเภทผู้หางาน
                </label>
                <select
                  value={jobSeekerType}
                  onChange={(e) => setJobSeekerType(e.target.value)}
                  className="border border-gray-300 p-2 rounded-md text-sm"
                >
                  {vulnerabilities.map((vul) => (
                    <option key={vul.id} value={vul.id}>
                      {vul.name}
                    </option>
                  ))}
                </select>
              </div>

              {form.values.workRestrictions.trim() !== "ไม่มี" && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    แนบเอกสารยืนยัน (รูปภาพ)
                  </label>
                  <Dropzone
                    onDrop={handleFileDrop}
                    accept={IMAGE_MIME_TYPE}
                    maxFiles={1}
                    onReject={() =>
                      showNotification({
                        title: "ข้อผิดพลาด",
                        message: "กรุณาเลือกไฟล์รูปภาพที่ถูกต้อง",
                        color: "red",
                      })
                    }
                  >
                    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                      {file ? (
                        <div>
                          <p>{file.name}</p>
                          {filePreview && (
                            <img
                              src={filePreview}
                              alt="Preview"
                              className="mt-4 max-h-48 object-contain mx-auto"
                            />
                          )}
                          <Button
                            variant="outline"
                            color="red"
                            size="xs"
                            mt="sm"
                            onClick={clearFile}
                          >
                            ลบไฟล์
                          </Button>
                        </div>
                      ) : (
                        <p>ลากและวางไฟล์ หรือคลิกเพื่อเลือก</p>
                      )}
                    </div>
                  </Dropzone>
                </div>
              )}

              <div className="flex justify-center">
                <Group align="center" mt="lg">
                  <button
                    type="submit"
                   
                    className="rounded-lg pt-2 pb-2 pl-4 pr-4 text-white bg-seagreen hover:bg-seagreen/90 transition flex"
                  >
                    ถัดไป
                  </button>
                </Group>
              </div>
            </Stack>
          </form>
        </Paper>
      </Container>

      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title="ข้อมูลที่กรอก"
      >
        {submittedData && (
          <div>
            <p>
              <strong>ระดับตำแหน่งงานที่สนใจ:</strong> {submittedData.jobLevel}
            </p>
            <p>
              <strong>เงินเดือนที่คาดหวัง:</strong>{" "}
              {submittedData.expectedSalary} บาท
            </p>
            <p>
              <strong>ประสบการณ์ทำงาน:</strong> {submittedData.experience} ปี
            </p>
            <p>
              <strong>ความสามารถพิเศษ:</strong> {submittedData.specialSkills}
            </p>
            <p>
              <strong>ข้อจำกัดในการทำงาน:</strong>{" "}
              {submittedData.workRestrictions}
            </p>
            <p>
              <strong>ไฟล์ที่แนบ:</strong>{" "}
              {submittedData.workRestrictions.trim() === "ไม่มี"
                ? "ไม่จำเป็น"
                : file?.name || "ไม่มีไฟล์"}
            </p>

            <Group align="right" mt="lg">
              <Button onClick={() => setModalOpen(false)} color="gray">
                แก้ไข
              </Button>
              <Button onClick={handleConfirm} color="green">
                ยืนยัน
              </Button>
            </Group>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default JobPositionForm;
