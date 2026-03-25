import React, { useState } from 'react';

export default function Bai1() {
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [empName, setEmpName] = useState('');
  const [maxPerDay, setMaxPerDay] = useState(3);
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  const [editEmpId, setEditEmpId] = useState(null);

  const [serviceName, setServiceName] = useState('');
  const [price, setPrice] = useState(0);
  const [duration, setDuration] = useState(30);
  const [editServiceId, setEditServiceId] = useState(null);

  const [customer, setCustomer] = useState('');
  const [empId, setEmpId] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const saveEmployee = () => {
    if (!empName) return alert('Nhập tên');
    if (editEmpId) {
      setEmployees(employees.map(e => e.id === editEmpId ? { ...e, name: empName, max: Number(maxPerDay), start, end } : e));
      setEditEmpId(null);
    } else {
      setEmployees([...employees, { id: Date.now(), name: empName, max: Number(maxPerDay), start, end }]);
    }
    setEmpName('');
  };

  const editEmployee = (e) => {
    setEmpName(e.name);
    setMaxPerDay(e.max);
    setStart(e.start);
    setEnd(e.end);
    setEditEmpId(e.id);
  };

  const deleteEmployee = (id) => setEmployees(employees.filter(e => e.id !== id));

  const saveService = () => {
    if (!serviceName) return alert('Nhập tên DV');
    if (editServiceId) {
      setServices(services.map(s => s.id === editServiceId ? { ...s, name: serviceName, price: Number(price), duration: Number(duration) } : s));
      setEditServiceId(null);
    } else {
      setServices([...services, { id: Date.now(), name: serviceName, price: Number(price), duration: Number(duration) }]);
    }
    setServiceName('');
  };

  const editService = (s) => {
    setServiceName(s.name);
    setPrice(s.price);
    setDuration(s.duration);
    setEditServiceId(s.id);
  };

  const deleteService = (id) => setServices(services.filter(s => s.id !== id));

  const isConflict = () => appointments.some(a => a.empId == empId && a.date === date && a.time === time && a.status !== 'cancelled');

  const addAppointment = () => {
    if (!customer || !empId || !serviceId || !date || !time) return alert('Nhập đủ thông tin');
    if (isConflict()) return alert('Trùng lịch');
    setAppointments([...appointments, { id: Date.now(), customer, empId, serviceId, date, time, status: 'pending' }]);
  };

  const updateStatus = (id, status) => {
    setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
  };

  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);

  const addReview = (appId) => {
    setReviews([...reviews, { id: Date.now(), appId, text: reviewText, rating, reply: '' }]);
    setReviewText('');
  };

  const replyReview = (id, reply) => {
    setReviews(reviews.map(r => r.id === id ? { ...r, reply } : r));
  };

  const avgRating = (empId) => {
    const empApps = appointments.filter(a => a.empId == empId);
    const empReviews = reviews.filter(r => empApps.find(a => a.id === r.appId));
    if (!empReviews.length) return 0;
    return (empReviews.reduce((s, r) => s + r.rating, 0) / empReviews.length).toFixed(1);
  };


  const today = new Date().toISOString().slice(0,10);
  const month = today.slice(0,7);

  const totalDay = appointments.filter(a => a.date === today).length;
  const totalMonth = appointments.filter(a => a.date.startsWith(month)).length;

  const revenue = appointments
    .filter(a => a.status === 'completed')
    .reduce((sum, a) => {
      const s = services.find(x => x.id == a.serviceId);
      return sum + (s?.price || 0);
    }, 0);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: 'auto' }}>
      <h2 style={{ textAlign: 'center' }}>Quản lý đặt lịch</h2>

      {}
      <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 20 }}>
        <h3>Nhân viên</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Tên nhân viên" value={empName} onChange={e => setEmpName(e.target.value)} />
          <input type="number" placeholder="Số khách/ngày" value={maxPerDay} onChange={e => setMaxPerDay(e.target.value)} />
          <label>Giờ bắt đầu</label>
          <input type="time" value={start} onChange={e => setStart(e.target.value)} />
          <label>Giờ kết thúc</label>
          <input type="time" value={end} onChange={e => setEnd(e.target.value)} />
          <button onClick={saveEmployee}>{editEmpId ? 'Cập nhật' : 'Thêm'}</button>
        </div>

        <div style={{ marginTop: 10 }}>
          {employees.map(e => (
            <div key={e.id}>
              {e.name} ({e.start}-{e.end})
              <button onClick={() => editEmployee(e)}>Sửa</button>
              <button onClick={() => deleteEmployee(e.id)}>X</button>
            </div>
          ))}
        </div>
      </div>

      {}
      <div style={{ border: '1px solid #ccc', padding: 12, marginBottom: 20 }}>
        <h3>Dịch vụ</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Tên dịch vụ" value={serviceName} onChange={e => setServiceName(e.target.value)} />
          <input type="number" placeholder="Giá" value={price} onChange={e => setPrice(e.target.value)} />
          <input type="number" placeholder="Thời gian (phút)" value={duration} onChange={e => setDuration(e.target.value)} />
          <button onClick={saveService}>{editServiceId ? 'Cập nhật' : 'Thêm'}</button>
        </div>

        <div style={{ marginTop: 10 }}>
          {services.map(s => (
            <div key={s.id}>
              {s.name} - {s.price}đ - {s.duration}p
              <button onClick={() => editService(s)}>Sửa</button>
              <button onClick={() => deleteService(s.id)}>X</button>
            </div>
          ))}
        </div>
      </div>

      {}
      <div style={{ border: '1px solid #ccc', padding: 12 }}>
        <h3>Đặt lịch</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input placeholder="Tên khách" value={customer} onChange={e => setCustomer(e.target.value)} />
          <select value={empId} onChange={e => setEmpId(e.target.value)}>
            <option value="">Chọn nhân viên</option>
            {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
          </select>
          <select value={serviceId} onChange={e => setServiceId(e.target.value)}>
            <option value="">Chọn dịch vụ</option>
            {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <label>Ngày</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          <label>Giờ</label>
          <input type="time" value={time} onChange={e => setTime(e.target.value)} />
          <button onClick={addAppointment}>Đặt</button>
        </div>

        <div style={{ marginTop: 10 }}>
          {appointments.map(a => (
            <div key={a.id}>
              {a.customer} - {a.date} {a.time} - {a.status}
              <button onClick={() => updateStatus(a.id, 'confirmed')}>✔</button>
              <button onClick={() => updateStatus(a.id, 'completed')}>Done</button>
              <button onClick={() => updateStatus(a.id, 'cancelled')}>X</button>
            </div>
          ))}
        </div>
      </div>
          {}
      <div style={{ border: '1px solid #ccc', padding: 12, marginTop: 20 }}>
        <h3>Đánh giá</h3>
        {appointments.filter(a => a.status === 'completed').map(a => (
          <div key={a.id}>
            {a.customer}
            <input placeholder="Nội dung" value={reviewText} onChange={e => setReviewText(e.target.value)} />
            <input type="number" min={1} max={5} value={rating} onChange={e => setRating(e.target.value)} />
            <button onClick={() => addReview(a.id)}>Gửi</button>
          </div>
        ))}

        {reviews.map(r => (
          <div key={r.id}>
            ⭐ {r.rating} - {r.text}
            <input placeholder="Phản hồi" onBlur={e => replyReview(r.id, e.target.value)} />
            <div>Reply: {r.reply}</div>
          </div>
        ))}
      </div>

      {}
      <div>
        <h3>ĐTB nhân viên</h3>
        {employees.map(e => (
          <div key={e.id}>{e.name}: {avgRating(e.id)}</div>
        ))}
      </div>

      {}
      <div>
        <h3>Thống kê</h3>
        <div>Ngày: {totalDay}</div>
        <div>Tháng: {totalMonth}</div>
        <div>Doanh thu: {revenue}</div>
      </div>

    </div>
  );
}
