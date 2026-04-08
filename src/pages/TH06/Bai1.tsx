import React, { useState } from 'react';
import {
  Card, Row, Col, Button, Select, Rate, Space,
  List, InputNumber, Alert, Modal, Input, Table
} from 'antd';

const { Option } = Select;

export default function Bai1() {
  const [places, setPlaces] = useState([
    {
      id: 1,
      name: 'Đà Nẵng',
      type: 'biển',
      price: 200,
      rating: 4,
      desc: 'Du lịch biển',
      food: 50,
      hotel: 100,
      travel: 50
    }
  ]);

  const [filter, setFilter] = useState({});
  const [schedule, setSchedule] = useState([]);
  const [budget, setBudget] = useState(500);

  const [open, setOpen] = useState(false);
  const [newPlace, setNewPlace] = useState({});

  const filtered = places.filter(p =>
    (!filter.type || p.type === filter.type)
  );

  const addToSchedule = (p) => {
    setSchedule([...schedule, p]);
  };

  const remove = (id) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  const total = schedule.reduce((sum, s) => sum + s.price, 0);

  const food = schedule.reduce((s, i) => s + i.food, 0);
  const hotel = schedule.reduce((s, i) => s + i.hotel, 0);
  const travel = schedule.reduce((s, i) => s + i.travel, 0);

  const addPlace = () => {
    setPlaces([...places, { ...newPlace, id: Date.now() }]);
    setOpen(false);
    setNewPlace({});
  };

  const stats = places.map(p => ({
    name: p.name,
    count: schedule.filter(s => s.id === p.id).length
  }));

  return (
    <div style={{ padding: 20 }}>
      <h2>TH06 - Du lịch</h2>

      <Space>
        <Select placeholder="Loại" style={{ width: 120 }}
          onChange={v => setFilter({ type: v })}
        >
          <Option value="biển">Biển</Option>
          <Option value="núi">Núi</Option>
          <Option value="thành phố">Thành phố</Option>
        </Select>

        <Button type="primary" onClick={() => setOpen(true)}>
          + Thêm điểm đến
        </Button>
      </Space>

      <Row gutter={16} style={{ marginTop: 20 }}>
        {filtered.map(p => (
          <Col xs={24} sm={12} md={8} key={p.id}>
            <Card
              title={p.name}
              actions={[
                <Button type="primary" onClick={() => addToSchedule(p)}>
                  Thêm
                </Button>
              ]}
            >
              <p>{p.desc}</p>
              <Rate value={p.rating} disabled />
              <p>Giá: {p.price}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 style={{ marginTop: 30 }}>Lịch trình</h3>
      <List
        bordered
        dataSource={schedule}
        renderItem={item => (
          <List.Item
            actions={[
              <Button danger onClick={() => remove(item.id)}>Xóa</Button>
            ]}
          >
            {item.name} - {item.price}
          </List.Item>
        )}
      />

      <h3>Ngân sách</h3>
      <Space>
        <InputNumber value={budget} onChange={setBudget} />
      </Space>

      <div>Tổng: {total}</div>

      {total > budget && <Alert type="error" message="Vượt ngân sách" />}

      <div>
        Ăn: {food} | Khách sạn: {hotel} | Di chuyển: {travel}
      </div>

      <h3 style={{ marginTop: 30 }}>Thống kê</h3>
      <Table
        dataSource={stats}
        columns={[
          { title: 'Địa điểm', dataIndex: 'name' },
          { title: 'Số lần chọn', dataIndex: 'count' }
        ]}
        rowKey="name"
      />

      <Modal
        title="Thêm điểm đến"
        open={open}
        onOk={addPlace}
        onCancel={() => setOpen(false)}
      >
        <Input placeholder="Tên"
          onChange={e => setNewPlace({ ...newPlace, name: e.target.value })}
        />
        <Input placeholder="Mô tả"
          onChange={e => setNewPlace({ ...newPlace, desc: e.target.value })}
        />
        <InputNumber placeholder="Giá"
          onChange={v => setNewPlace({ ...newPlace, price: v })}
        />
        <Select placeholder="Loại" style={{ width: '100%' }}
          onChange={v => setNewPlace({ ...newPlace, type: v })}
        >
          <Option value="biển">Biển</Option>
          <Option value="núi">Núi</Option>
        </Select>
      </Modal>
    </div>
  );
}