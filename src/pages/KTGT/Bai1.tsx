import React, { useState, useMemo } from 'react';
import { Table, Input, Select, Button, Space, Tag } from 'antd';

const { Option } = Select;

export default function Bai1() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('Tất cả');
  const [sort, setSort] = useState('');

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  const [formId, setFormId] = useState('');
  const [formCustomer, setFormCustomer] = useState('');
  const [formStatus, setFormStatus] = useState('Chờ xác nhận');
  const [formProducts, setFormProducts] = useState<any[]>([]);

  const customers = ['An', 'Bình', 'Cường'];

  const products = [
    { id: 1, name: 'SP1', price: 100 },
    { id: 2, name: 'SP2', price: 200 }
  ];

  const total = formProducts.reduce((sum, id) => {
    const p = products.find(x => x.id === id);
    return sum + (p ? p.price : 0);
  }, 0);

  const data = useMemo(() => {
    let result = [...orders];

    if (search) {
      result = result.filter(o =>
        o.id.includes(search) || o.customer.includes(search)
      );
    }

    if (statusFilter !== 'Tất cả') {
      result = result.filter(o => o.status === statusFilter);
    }

    if (sort === 'date') {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    if (sort === 'price') {
      result.sort((a, b) => a.total - b.total);
    }

    return result;
  }, [orders, search, statusFilter, sort]);

  const openAdd = () => {
    setEditing(null);
    setFormId('');
    setFormCustomer('');
    setFormProducts([]);
    setFormStatus('Chờ xác nhận');
    setOpen(true);
  };

  const openEdit = (record: any) => {
    setEditing(record);
    setFormId(record.id);
    setFormCustomer(record.customer);
    setFormProducts(record.products);
    setFormStatus(record.status);
    setOpen(true);
  };

  const save = () => {
    if (!formId || !formCustomer || formProducts.length === 0) {
      alert('Nhập đủ dữ liệu');
      return;
    }

    if (!editing && orders.find(o => o.id === formId)) {
      alert('Trùng mã');
      return;
    }

    const newOrder = {
      id: formId,
      customer: formCustomer,
      products: formProducts,
      total,
      status: formStatus,
      date: editing ? editing.date : new Date().toISOString()
    };

    if (editing) {
      setOrders(orders.map(o => o.id === editing.id ? newOrder : o));
    } else {
      setOrders([...orders, newOrder]);
    }

    setOpen(false);
  };

  const cancelOrder = (record: any) => {
    if (record.status !== 'Chờ xác nhận') {
      return alert('Chỉ hủy khi chờ xác nhận');
    }

    if (confirm('Xác nhận hủy?')) {
      setOrders(orders.filter(o => o.id !== record.id));
    }
  };

  const columns = [
    { title: 'Mã', dataIndex: 'id' },
    { title: 'Khách', dataIndex: 'customer' },
    { title: 'Ngày', render: (_: any, r: any) => new Date(r.date).toLocaleDateString() },
    { title: 'Tổng', dataIndex: 'total' },
    { title: 'Trạng thái', render: (_: any, r: any) => <Tag>{r.status}</Tag> },
    {
      title: 'Hành động',
      render: (_: any, r: any) => (
        <Space>
          <Button onClick={() => openEdit(r)}>Sửa</Button>
          <Button danger onClick={() => cancelOrder(r)}>Hủy</Button>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý đơn hàng</h2>

      <Space>
        <Input placeholder="Tìm kiếm" onChange={e => setSearch(e.target.value)} />

        <Select style={{ width: 150 }} onChange={setStatusFilter}>
          <Option value="Tất cả">Tất cả</Option>
          <Option value="Chờ xác nhận">Chờ xác nhận</Option>
          <Option value="Đang giao">Đang giao</Option>
          <Option value="Hoàn thành">Hoàn thành</Option>
          <Option value="Hủy">Hủy</Option>
        </Select>

        <Select style={{ width: 150 }} onChange={setSort}>
          <Option value="date">Theo ngày</Option>
          <Option value="price">Theo tiền</Option>
        </Select>

        <Button type="primary" onClick={openAdd}>+ Thêm</Button>
      </Space>

      <Table dataSource={data} columns={columns} rowKey="id" style={{ marginTop: 20 }} />

      {open && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <div style={{ background: '#fff', padding: 20, width: 400 }}>
            <h3>{editing ? 'Sửa đơn' : 'Thêm đơn'}</h3>

            <Input placeholder="Mã đơn" value={formId} disabled={!!editing}
              onChange={e => setFormId(e.target.value)} />

            <Select value={formCustomer} style={{ width: '100%', marginTop: 10 }}
              onChange={setFormCustomer}>
              {customers.map(c => <Option key={c}>{c}</Option>)}
            </Select>

            <Select mode="multiple" style={{ width: '100%', marginTop: 10 }}
              value={formProducts}
              onChange={setFormProducts}>
              {products.map(p => (
                <Option key={p.id} value={p.id}>
                  {p.name} - {p.price}
                </Option>
              ))}
            </Select>

            <div style={{ marginTop: 10 }}>
              Tổng: <b>{total}</b>
            </div>

            <Select value={formStatus} style={{ width: '100%', marginTop: 10 }}
              onChange={setFormStatus}>
              <Option value="Chờ xác nhận">Chờ xác nhận</Option>
              <Option value="Đang giao">Đang giao</Option>
              <Option value="Hoàn thành">Hoàn thành</Option>
            </Select>

            <Space style={{ marginTop: 15 }}>
              <Button onClick={() => setOpen(false)}>Đóng</Button>
              <Button type="primary" onClick={save}>Lưu</Button>
            </Space>
          </div>
        </div>
      )}
    </div>
  );
}