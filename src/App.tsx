import { useMemo, useState } from 'react';
import { Activity, Baby, ClipboardList, FileText, HeartPulse, LayoutDashboard, Plus, Ruler, Search, Utensils, Moon, ArrowUpRight } from 'lucide-react';

type FormState = { name: string; dob: string; sex: string; date: string; weight: string; length: string; head: string; measureType: string };
const today = new Date().toISOString().slice(0,10);
const initial: FormState = { name: '', dob: '', sex: 'female', date: today, weight: '', length: '', head: '', measureType: 'recumbent' };

export default function App() {
  const [form, setForm] = useState<FormState>(initial);
  const [saved, setSaved] = useState(false);
  const bmi = useMemo(() => {
    const w = Number(form.weight), h = Number(form.length);
    return w > 0 && h > 0 ? (w / ((h / 100) ** 2)).toFixed(2) : '—';
  }, [form.weight, form.length]);
  const update = (key: keyof FormState, value: string) => { setForm(p => ({ ...p, [key]: value })); setSaved(false); };
  const complete = Boolean(form.name && form.dob && form.date && Number(form.weight) > 0 && Number(form.length) > 0);
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Baby size={23}/></div><div><b>BS GIANG</b><span>PEDIATRICS</span></div></div>
      <div className="nav-label">WORKSPACE</div>
      <a className="nav active"><LayoutDashboard size={18}/> Tổng quan</a>
      <a className="nav"><Baby size={18}/> Hồ sơ bệnh nhi</a>
      <a className="nav"><Ruler size={18}/> Đánh giá nhân trắc</a>
      <a className="nav"><Utensils size={18}/> Ăn uống & sinh hoạt</a>
      <a className="nav"><FileText size={18}/> Báo cáo tư vấn</a>
      <div className="sidebar-bottom"><div className="avatar">BG</div><div><b>BS Giang</b><span>Quản trị viên</span></div></div>
    </aside>
    <main className="main">
      <header className="topbar"><div><span className="crumb">Phòng khám /</span> Nutrition Assessment</div><div className="top-right"><span className="status-dot"/> Bản thử nghiệm V1.0</div></header>
      <section className="welcome"><div><div className="eyebrow">PEDIATRIC GROWTH & NUTRITION</div><h1>Nutrition Assessment</h1><p>Đánh giá tăng trưởng và xây dựng tư vấn dinh dưỡng cá thể hóa cho trẻ dưới 5 tuổi.</p></div><div className="welcome-icon"><HeartPulse size={34}/></div></section>
      <section className="stats">
        <div className="stat"><div className="stat-icon purple"><Baby/></div><div><span>Đối tượng</span><b>0–5 tuổi</b><small>WHO Child Growth Standards</small></div></div>
        <div className="stat"><div className="stat-icon mint"><Activity/></div><div><span>Đánh giá</span><b>Nhân trắc + dinh dưỡng</b><small>Nhập liệu có kiểm tra</small></div></div>
        <div className="stat"><div className="stat-icon peach"><FileText/></div><div><span>Đầu ra</span><b>2 báo cáo</b><small>Bác sĩ & phụ huynh</small></div></div>
      </section>
      <div className="section-heading"><div><h2><Plus size={20}/> Tạo đánh giá mới</h2><p>Nhập thông tin cơ bản và chỉ số đo tại lần khám hiện tại.</p></div><div className="tag">DỮ LIỆU DEMO / CHƯA LƯU SERVER</div></div>
      <div className="workspace">
        <section className="panel">
          <div className="panel-title"><span className="step">01</span><div><h3>Thông tin bệnh nhi</h3><p>Patient Profile</p></div></div>
          <div className="form-grid">
            <label className="wide">Họ và tên trẻ<input value={form.name} onChange={e=>update('name',e.target.value)} placeholder="Nhập họ tên"/></label>
            <label>Ngày sinh<input type="date" value={form.dob} onChange={e=>update('dob',e.target.value)}/></label>
            <label>Ngày đánh giá<input type="date" value={form.date} onChange={e=>update('date',e.target.value)}/></label>
            <label className="wide">Giới tính<select value={form.sex} onChange={e=>update('sex',e.target.value)}><option value="female">Nữ</option><option value="male">Nam</option></select></label>
          </div>
          <div className="panel-title second"><span className="step">02</span><div><h3>Chỉ số nhân trắc</h3><p>Anthropometric Assessment</p></div></div>
          <div className="form-grid">
            <label>Cân nặng (kg)<input type="number" min="0" step="0.001" value={form.weight} onChange={e=>update('weight',e.target.value)} placeholder="Ví dụ: 8.250"/></label>
            <label>Chiều dài / cao (cm)<input type="number" min="0" step="0.1" value={form.length} onChange={e=>update('length',e.target.value)} placeholder="Ví dụ: 70.5"/></label>
            <label>Vòng đầu (cm)<input type="number" min="0" step="0.1" value={form.head} onChange={e=>update('head',e.target.value)} placeholder="Không bắt buộc"/></label>
            <label>Phương pháp đo<select value={form.measureType} onChange={e=>update('measureType',e.target.value)}><option value="recumbent">Chiều dài nằm</option><option value="standing">Chiều cao đứng</option></select></label>
          </div>
          <div className="notice"><Activity size={17}/><span>V1.0 đang là giao diện nhập liệu thử nghiệm. Chưa tính hoặc phân loại Z-score WHO và chưa lưu hồ sơ bệnh nhi.</span></div>
          <button className="primary" disabled={!complete} onClick={()=>setSaved(true)}>Kiểm tra dữ liệu nhập <ArrowUpRight size={17}/></button>
          {saved && <div className="success">Đã kiểm tra trường bắt buộc ở giao diện demo. Chưa lưu dữ liệu lên máy chủ.</div>}
        </section>
        <aside className="right-col">
          <section className="panel preview"><div className="preview-head"><div><h3>Tóm tắt lần khám</h3><p>Assessment snapshot</p></div><ClipboardList color="#8061ad"/></div>
            <div className="metric"><span>Cân nặng</span><b>{form.weight ? `${form.weight} kg` : '—'}</b></div>
            <div className="metric"><span>Chiều dài / cao</span><b>{form.length ? `${form.length} cm` : '—'}</b></div>
            <div className="metric"><span>BMI tham khảo</span><b>{bmi}</b></div>
            <div className="metric"><span>Vòng đầu</span><b>{form.head ? `${form.head} cm` : '—'}</b></div>
            <div className="preview-foot">BMI chỉ là phép tính số học. Ở trẻ nhỏ, cần diễn giải theo tuổi và giới tính bằng chuẩn tăng trưởng phù hợp.</div>
          </section>
          <section className="panel next"><div className="next-icon"><Utensils/></div><h3>Bước tiếp theo</h3><p>Hoàn thiện hồ sơ ăn uống, giấc ngủ, vận động và hành vi ăn để xây dựng đánh giá toàn diện.</p><div className="next-row"><Moon size={16}/> Lifestyle & Dietary Assessment</div></section>
        </aside>
      </div>
      <footer>BS GIANG PEDIATRICS · NUTRITION ASSESSMENT DIGITAL TOOL <span>Prototype V0.1 · Không dùng cho quyết định lâm sàng</span></footer>
    </main>
  </div>;
}