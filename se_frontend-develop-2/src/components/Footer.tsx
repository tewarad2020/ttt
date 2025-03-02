import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-seagreen/80 text-white py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center kanit-regular">
          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-lg font-semibold ">วิธีใช้</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/postemp" className="hover:underline">
                  การโพสต์งาน
                </Link>
              </li>
              <li>
                <Link to="/trackemp" className="hover:underline">
                  การติดตามผลของผู้สมัคร
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-lg font-semibold ">ติดต่อเรา</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/support" className="hover:underline">
                  การสนับสนุน
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:underline">
                  คำถามที่พบบ่อย
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h4 className="text-lg font-semibold">เกี่ยวกับ SkillBridge</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/mission" className="hover:underline">
                  พันธกิจของเรา
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:underline">
                  ทีมของเรา
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-emerald-400 text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} SkillBridge. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
