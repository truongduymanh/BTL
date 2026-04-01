import React, { useState } from 'react';
import { Table, Button, Input, Space, Modal, Select } from 'antd';

export default function Bai1() {
  const [clubs, setClubs] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);

  const [clubForm, setClubForm] = useState<any>({});
  const [appForm, setAppForm] = useState<any>({});

  const addClub = () => {
    if (!clubForm.name) return;
    setClubs([...clubs, { ...clubForm, id: Date.now() }]);
    setClubForm({});
  };

  const deleteClub = (id: number) => {
    setClubs(clubs.filter(c => c.id !== id));
  };

  const addApp = () => {
    if (!appForm.name || !appForm.clubId) return;
    setApplications([
      ...applications,
      { ...appForm, id: Date.now(), status: 'Pending' }
    ]);
    setAppForm({});
  };

  const approve = (ids: any[]) => {
    const time = new Date().toLocaleString();

    setApplications(applications.map(a =>
      ids.includes(a.id) ? { ...a, status: 'Approved' } : a
    ));

    const approved = applications.filter(a => ids.includes(a.id));

    setMembers([
      ...members,
      ...approved.map(a => ({ ...a }))
    ]);

    setLogs([...logs, ...ids.map(id => ({
      id: Date.now() + id,
      text: `Approved đơn ${id} lúc ${time}`
    }))]);
  };

  const reject = () => {
    let reason = '';
    Modal.confirm({
      title: 'Nhập lý do',
      content: <Input onChange={e => reason = e.target.value} />,
      onOk: () => {
        const time = new Date().toLocaleString();

        setApplications(applications.map(a =>
          selectedRowKeys.includes(a.id)
            ? { ...a, status: 'Rejected', note: reason }
            : a
        ));

        setLogs([...logs, ...selectedRowKeys.map(id => ({
          id: Date.now() + id,
          text: `Rejected đơn ${id} lúc ${time} - ${reason}`
        }))]);
      }
    });
  };

  const changeClub = () => {
    let newClub: any;

    Modal.confirm({
      title: `Chuyển ${selectedRowKeys.length} thành viên`,
      content: (
        <Select style={{ width: '100%' }} onChange={v => newClub = v}>
          {clubs.map(c => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      ),
      onOk: () => {
        setMembers(members.map(m =>
          selectedRowKeys.includes(m.id)
            ? { ...m, clubId: newClub }
            : m
        ));
      }
    });
  };

 
  const clubColumns = [
    { title: 'Tên CLB', dataIndex: 'name' },
    { title: 'Chủ nhiệm', dataIndex: 'leader' },
    {
      title: 'Hoạt động',
      render: (_: any, r: any) => r.active ? 'Có' : 'Không'
    },
    {
      title: 'Hành động',
      render: (_: any, r: any) => (
        <Button danger onClick={() => deleteClub(r.id)}>Xóa</Button>
      )
    }
  ];

  const appColumns = [
    { title: 'Họ tên', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'SĐT', dataIndex: 'phone' },
    {
      title: 'CLB',
      render: (_: any, r: any) =>
        clubs.find(c => c.id === r.clubId)?.name
    },
    { title: 'Trạng thái', dataIndex: 'status' }
  ];

  const memberColumns = [
    { title: 'Họ tên', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'CLB',
      render: (_: any, r: any) =>
        clubs.find(c => c.id === r.clubId)?.name
    }
  ];

  
  return (
    <div style={{ padding: 20 }}>
      <h2>TH05 - Quản lý CLB</h2>

      {}
      <h3>Câu lạc bộ</h3>
      <Space>
        <Input placeholder="Tên CLB" onChange={e => setClubForm({ ...clubForm, name: e.target.value })} />
        <Input placeholder="Chủ nhiệm" onChange={e => setClubForm({ ...clubForm, leader: e.target.value })} />
        <Button type="primary" onClick={addClub}>Thêm</Button>
      </Space>

      <Table rowKey="id" dataSource={clubs} columns={clubColumns} />

      {}
      <h3>Đơn đăng ký</h3>
      <Space>
        <Input placeholder="Họ tên" onChange={e => setAppForm({ ...appForm, name: e.target.value })} />
        <Input placeholder="Email" onChange={e => setAppForm({ ...appForm, email: e.target.value })} />
        <Input placeholder="SĐT" onChange={e => setAppForm({ ...appForm, phone: e.target.value })} />
        <Select style={{ width: 150 }} placeholder="CLB" onChange={v => setAppForm({ ...appForm, clubId: v })}>
          {clubs.map(c => (
            <Select.Option key={c.id} value={c.id}>{c.name}</Select.Option>
          ))}
        </Select>
        <Button type="primary" onClick={addApp}>Thêm</Button>
      </Space>

      <Space style={{ marginTop: 10 }}>
        <Button onClick={() => approve(selectedRowKeys)}>Duyệt</Button>
        <Button danger onClick={reject}>Từ chối</Button>
      </Space>

      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        dataSource={applications}
        columns={appColumns}
      />

      {}
      <h3>Thành viên</h3>
      <Button onClick={changeClub}>Chuyển CLB</Button>

      <Table
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys
        }}
        dataSource={members.filter(m => m.status === 'Approved')}
        columns={memberColumns}
      />

      {}
      <h3>Thống kê</h3>
      <div>Tổng CLB: {clubs.length}</div>
      <div>Pending: {applications.filter(a => a.status === 'Pending').length}</div>
      <div>Approved: {applications.filter(a => a.status === 'Approved').length}</div>
      <div>Rejected: {applications.filter(a => a.status === 'Rejected').length}</div>

      {}
      <h3>Lịch sử</h3>
      {logs.map(l => <div key={l.id}>{l.text}</div>)}
    </div>
  );
}