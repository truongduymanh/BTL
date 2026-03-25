import React, { useState } from 'react';
import { Button, Input, Table, Space, Select, DatePicker } from 'antd';

export default function Bai1() {
  const [books, setBooks] = useState<any[]>([]);
  const [decisions, setDecisions] = useState<any[]>([]);
  const [fields, setFields] = useState<any[]>([]);
  const [degrees, setDegrees] = useState<any[]>([]);
  const [searchCount, setSearchCount] = useState<any>({});

  const [year, setYear] = useState('');
  const [decisionForm, setDecisionForm] = useState<any>({});
  const [form, setForm] = useState<any>({});
  const [query, setQuery] = useState<any>({});
  const [result, setResult] = useState<any[]>([]);

  const addBook = () => {
    if (!year) return;
    setBooks([...books, { id: Date.now(), year, current: 0 }]);
    setYear('');
  };

  const addDecision = () => {
    if (!decisionForm.soQD || !decisionForm.bookId) return;
    setDecisions([...decisions, { ...decisionForm, id: Date.now() }]);
    setDecisionForm({});
  };

  const addField = () => {
    const name = prompt('Tên field');
    const type = prompt('string / number / date');
    if (!name || !type) return;
    setFields([...fields, { id: Date.now(), name, type }]);
  };

  const addDegree = () => {
    if (!form.soHieu || !form.msv || !form.hoTen || !form.ngaySinh) {
      return alert('Nhập đủ thông tin');
    }

    const decision = decisions.find(d => d.id === form.decisionId);
    if (!decision) return alert('Chọn quyết định');

    const book = books.find(b => b.id === decision.bookId);
    const newNumber = book.current + 1;

    setBooks(books.map(b =>
      b.id === book.id ? { ...b, current: newNumber } : b
    ));

    setDegrees([...degrees, {
      id: Date.now(),
      soVaoSo: newNumber,
      soHieu: form.soHieu,
      msv: form.msv,
      hoTen: form.hoTen,
      ngaySinh: form.ngaySinh,
      extra: form.extra || {},
      decisionId: decision.id
    }]);

    setForm({});
  };

  const search = () => {
    const filled = Object.values(query).filter(v => v).length;
    if (filled < 2) return alert('Nhập >= 2 điều kiện');

    const res = degrees.filter(d =>
      (!query.msv || d.msv === query.msv) &&
      (!query.hoTen || d.hoTen?.includes(query.hoTen)) &&
      (!query.soHieu || d.soHieu === query.soHieu) &&
      (!query.soVaoSo || d.soVaoSo == query.soVaoSo) &&
      (!query.ngaySinh || d.ngaySinh === query.ngaySinh)
    );

    const newCount = { ...searchCount };
    res.forEach(r => {
      newCount[r.decisionId] = (newCount[r.decisionId] || 0) + 1;
    });

    setSearchCount(newCount);
    setResult(res);
  };

  const columns = [
    { title: 'Họ tên', dataIndex: 'hoTen' },
    { title: 'MSV', dataIndex: 'msv' },
    { title: 'Số hiệu', dataIndex: 'soHieu' },
    { title: 'Số vào sổ', dataIndex: 'soVaoSo' },
    {
      title: 'Quyết định',
      render: (r: any) =>
        decisions.find(d => d.id === r.decisionId)?.soQD
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>TH04</h2>

      <Space>
        <Input placeholder="Năm" value={year} onChange={e => setYear(e.target.value)} />
        <Button type="primary" onClick={addBook}>Thêm sổ</Button>
      </Space>

      <h3>Quyết định</h3>
      <Space>
        <Input placeholder="Số QĐ" value={decisionForm.soQD}
          onChange={e => setDecisionForm({ ...decisionForm, soQD: e.target.value })} />
        <DatePicker onChange={(_, d) => setDecisionForm({ ...decisionForm, ngay: d })} />
        <Input placeholder="Trích yếu"
          onChange={e => setDecisionForm({ ...decisionForm, trichYeu: e.target.value })} />
        <Select placeholder="Chọn sổ" style={{ width: 120 }}
          onChange={v => setDecisionForm({ ...decisionForm, bookId: v })}>
          {books.map(b => <Select.Option key={b.id} value={b.id}>{b.year}</Select.Option>)}
        </Select>
        <Button onClick={addDecision}>Thêm</Button>
      </Space>

      <h3>Field</h3>
      <Button onClick={addField}>+ Field</Button>
      {fields.map(f => <div key={f.id}>{f.name} ({f.type})</div>)}

      <h3>Văn bằng</h3>
      <Space wrap>
        <Input placeholder="Số hiệu"
          value={form.soHieu}
          onChange={e => setForm({ ...form, soHieu: e.target.value })} />

        <Input placeholder="MSV"
          value={form.msv}
          onChange={e => setForm({ ...form, msv: e.target.value })} />

        <Input placeholder="Họ tên"
          value={form.hoTen}
          onChange={e => setForm({ ...form, hoTen: e.target.value })} />

        <DatePicker onChange={(_, d) => setForm({ ...form, ngaySinh: d })} />

        <Select placeholder="Quyết định" style={{ width: 150 }}
          onChange={v => setForm({ ...form, decisionId: v })}>
          {decisions.map(d => <Select.Option key={d.id} value={d.id}>{d.soQD}</Select.Option>)}
        </Select>

        {fields.map(f => (
          f.type === 'number' ? (
            <Input key={f.id} type="number" placeholder={f.name}
              onChange={e => setForm({
                ...form,
                extra: { ...form.extra, [f.name]: Number(e.target.value) }
              })} />
          ) : f.type === 'date' ? (
            <DatePicker key={f.id}
              onChange={(_, d) => setForm({
                ...form,
                extra: { ...form.extra, [f.name]: d }
              })} />
          ) : (
            <Input key={f.id} placeholder={f.name}
              onChange={e => setForm({
                ...form,
                extra: { ...form.extra, [f.name]: e.target.value }
              })} />
          )
        ))}

        <Button type="primary" onClick={addDegree}>Thêm</Button>
      </Space>

      <Table dataSource={degrees} columns={columns} rowKey="id" style={{ marginTop: 20 }} />

      <h3>Tra cứu</h3>
      <Space>
        <Input placeholder="MSV" onChange={e => setQuery({ ...query, msv: e.target.value })} />
        <Input placeholder="Họ tên" onChange={e => setQuery({ ...query, hoTen: e.target.value })} />
        <Input placeholder="Số hiệu" onChange={e => setQuery({ ...query, soHieu: e.target.value })} />
        <Input placeholder="Số vào sổ" onChange={e => setQuery({ ...query, soVaoSo: e.target.value })} />
        <Input placeholder="Ngày sinh" onChange={e => setQuery({ ...query, ngaySinh: e.target.value })} />
        <Button onClick={search}>Tìm</Button>
      </Space>

      {result.map(r => (
        <div key={r.id}>
          {r.hoTen} - {r.soHieu} - QĐ: {decisions.find(d => d.id === r.decisionId)?.soQD}
        </div>
      ))}

      <h3>Lượt tra cứu</h3>
      {Object.entries(searchCount).map(([k, v]) => {
        const d = decisions.find(x => x.id == k);
        return <div key={k}>QĐ {d?.soQD}: {v}</div>;
      })}
    </div>
  );
}