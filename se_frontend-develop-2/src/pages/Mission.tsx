import React from "react";
import { Navbar } from "../components/Navbar";

function Mission() {
  return (
    <div>
      <Navbar
        user={undefined}
        isLoading={false}
        isHaveUser={false}
        refetchjobseeker={function (): void {
          throw new Error("Function not implemented.");
        }}
        refetchemployer={function (): void {
          throw new Error("Function not implemented.");
        }}
        refetchCompany={function (): void {
          throw new Error("Function not implemented.");
        }}
        isStale={false}
        setUser={function (value: any): void {
          throw new Error("Function not implemented.");
        }}
      />
      <div className="kanit-regular  flex flex-col">
        <div className="flex flex-col items-center justify-center flex-grow">
          <h1 className="text-4xl font-bold mt-4">ภารกิจของเรา</h1>
          <p className="text-lg text-center max-w-2xl">
            ภารกิจของเราคือการสร้างแพลตฟอร์มการโพสต์งานที่ครอบคลุมซึ่งช่วยให้ผู้สูงอายุและผู้พิการสามารถเข้าถึงและมีโอกาสในการทำงานที่เหมาะสม
            เรามุ่งมั่นที่จะเชื่อมโยงช่องว่างระหว่างนายจ้างและผู้หางาน
            สร้างสรรค์แรงงานที่หลากหลายและสนับสนุนที่ทุกคนสามารถเติบโตได้
          </p>
        </div>
      </div>
    </div>
  );
}

export default Mission;
