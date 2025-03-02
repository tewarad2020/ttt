import { useState } from "react";
import { useForm, UseFormReturnType } from "@mantine/form";
import {
  TextInput,
  Button,
  Container,
  Paper,
  Title,
  Grid,
  Stack,
  Select,
  Switch,
  Checkbox,
} from "@mantine/core";

// Interface สำหรับ InputProps
interface InputProps {
  label: string;
  placeholder: string;
  inputProps: ReturnType<UseFormReturnType<any>["getInputProps"]>;
  size: "short" | "medium" | "long";
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

const JobSeekerProfile = () => {
  const [hasExperience, setHasExperience] = useState<boolean>(true);
  const [hasDesiredJobCategory, setHasDesiredJobCategory] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  document.body.style.backgroundColor = "#f7f9fc";


  const form = useForm({
    initialValues: {
      firstName: "",
      lastName: "",
      location: "",
      jobTitle: "",
      company: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      currentlyWorking: false,
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Submitted values:", values);
  };

  // ฟังก์ชันสร้าง TextInput (รองรับขนาด short, medium, long)
  const renderTextInput = ({ label, placeholder, inputProps, size }: InputProps) => (
    <TextInput
      label={label}
      placeholder={placeholder}
      className="font-kanit"
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

  return (
    <Container
    size="md"
    className="mt-11 mb-14"
    styles={{
      root: {
        maxWidth: "800px",
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "2rem", 
        backgroundColor: "#f7f9fc",
        borderRadius: "10px",
        padding: "2rem",
      },
    }}
  >
    <Paper
      shadow="lg"
      radius="lg"
      p="xl"
      className="rounded-xl p-6 font-kanit"
      styles={{
        root: {
          backgroundColor: "#ffffff",
          paddingLeft: "7rem",
          paddingRight: "2rem", 
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 4px 10px",
          border: "1px solid #e0e0e0",
        },
      }}
    >

        <Title order={1} className="text-gray-800 mb-4 text-left text-2xl font-bold">
          ใกล้เสร็จแล้ว
        </Title>
        <p className="text-left text-gray-600 mb-6 text-md leading-relaxed mt-1">
          ผู้ประกอบการจะพบคุณ เพียงสร้างโปรไฟล์กับ SkillBridge
        </p>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap="lg">
            {/* ชื่อและนามสกุล (ขนาดกลาง) */}
            <Grid grow>
              <Grid.Col span={4}>
                {renderTextInput({
                  label: "ชื่อ",
                  placeholder: "กรอกชื่อ",
                  inputProps: form.getInputProps("firstName"),
                  size: "medium",
                })}
              </Grid.Col>
              <Grid.Col span={8}>
                {renderTextInput({
                  label: "นามสกุล",
                  placeholder: "กรอกนามสกุล",
                  inputProps: form.getInputProps("lastName"),
                  size: "medium",
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
                onChange={(e) => setHasExperience(e.currentTarget.checked)}
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
                })}
                {renderTextInput({
                  label: "บริษัท",
                  placeholder: "ชื่อบริษัท",
                  inputProps: form.getInputProps("company"),
                  size: "long",
                })}

                <Grid grow>
                  <Grid.Col span={4}>
                    <label className="text-gray-700 font-kanit font-medium text-md">ตั้งแต่</label>
                    {renderDateGroup({
                      monthProp: form.getInputProps("startMonth"),
                      yearProp: form.getInputProps("startYear"),
                    })}
                  </Grid.Col>
                  <Grid.Col span={5} className="flex items-center">
                      </Grid.Col>
                </Grid>


                <Grid grow>
                  <Grid.Col>
                    <label className="text-gray-700 font-kanit font-medium text-md">ถึง</label>
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
                    onChange={(e) => setHasDesiredJobCategory(e.currentTarget.checked)}
                    color="green"
                    classNames={{ label: "text-gray-700 font-kanit" }}
                  />

                  {hasDesiredJobCategory && (
                    <div className="space-y-4">
                      <Select
                        label="เลือกประเภทงานหลัก"
                        placeholder="เลือกประเภทงาน"
                        data={jobCategories}
                        value={selectedCategory}
                        onChange={setSelectedCategory}
                        className="font-kanit"
                        styles={{
                          input: {
                            border: "1.5px solid #e2e8f0",
                            padding: "0.4rem 0.6rem",
                            borderRadius: "6px",
                            "&:focus": { borderColor: "#2E8B57" },
                          },
                        }}
                      />

                      {selectedCategory && (
                        <Select
                          label="เลือกสายงานย่อย"
                          placeholder="เลือกสายงาน"
                          data={subCategories[selectedCategory as keyof typeof subCategories]}
                          className="font-kanit"
                          styles={{
                            input: {
                              border: "1.5px solid #e2e8f0",
                              padding: "0.4rem 0.6rem",
                              borderRadius: "6px",
                              "&:focus": { borderColor: "#2E8B57" },
                            },
                          }}
                          {...form.getInputProps("desiredSubCategory")}
                        />
                      )}
                    </div>
                  )}
                </div>

            <div className="flex justify-center w-full mt-4">
            <Button
            type="submit"
            size="md"
            fullWidth
            variant="filled"
            color="green"
            className="h-12 text-md font-medium tracking-wide max-w-sm"
            styles={{
              root: {
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": {
                  transform: "translateY(-3px)",
                  boxShadow: "0px 6px 15px rgba(0, 0, 0, 0.2)",
                },
                "&:active": {
                  transform: "translateY(1px)",
                },
              },
            }}
          >
            บันทึก
          </Button>
          </div>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default JobSeekerProfile;
