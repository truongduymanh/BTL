import React, { useState, useMemo } from 'react';
import {
  Card, Row, Col, Table, Button, Modal, Form, Input,
  Select, DatePicker, Tag, Progress, Drawer,
  Popconfirm, Segmented, Timeline, Typography, Space, InputNumber
} from 'antd';
import { Column, Line } from '@ant-design/plots';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

// ===== TYPES =====
type WorkoutType = 'Cardio' | 'Strength' | 'Yoga' | 'HIIT' | 'Other';
type Status = 'Hoàn thành' | 'Bỏ lỡ';

interface Workout {
  id: string;
  name: string;
  date: string;
  type: WorkoutType;
  duration: number;
  calories: number;
  note: string;
  status: Status;
}

interface Health {
  id: string;
  date: string;
  weight: number;
  height: number;
  heart: number;
  sleep: number;
}

interface Goal {
  id: string;
  name: string;
  type: 'Giảm cân' | 'Tăng cơ' | 'Sức bền' | 'Khác';
  target: number;
  current: number;
  deadline: string;
  status: 'Đang thực hiện' | 'Đã đạt' | 'Đã hủy';
}

interface Exercise {
  id: string;
  name: string;
  muscle: string;
  level: 'Dễ' | 'Trung bình' | 'Khó';
  desc: string;
  caloriesPerHour: number;
}

export default function FitnessApp() {
  // ===== STATE MANAGEMENT =====
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [healths, setHealths] = useState<Health[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: 'Plank', muscle: 'Core', level: 'Dễ', caloriesPerHour: 200, desc: 'Giữ người thẳng trên khuỷu tay...' },
    { id: '2', name: 'Squat', muscle: 'Legs', level: 'Trung bình', caloriesPerHour: 400, desc: 'Hạ thấp hông như đang ngồi ghế...' }
  ]);

  // Form & UI States
  const [isWokoutModal, setIsWorkoutModal] = useState(false);
  const [isHealthModal, setIsHealthModal] = useState(false);
  const [isGoalDrawer, setIsGoalDrawer] = useState(false);
  const [isExDetail, setIsExDetail] = useState<Exercise | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  const [workoutForm] = Form.useForm();
  const [healthForm] = Form.useForm();
  const [goalForm] = Form.useForm();

  // Filters
  const [searchW, setSearchW] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [goalFilter, setGoalFilter] = useState('All');

  // ===== LOGIC TÍNH TOÁN =====
  const calcBMI = (w: number, h: number) => w / ((h / 100) ** 2);
  const getBMITag = (bmi: number) => {
    if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
    if (bmi < 25) return <Tag color="green">Bình thường</Tag>;
    if (bmi < 30) return <Tag color="gold">Thừa cân</Tag>;
    return <Tag color="red">Béo phì</Tag>;
  };

  const dashboardStats = useMemo(() => {
    const totalCalo = workouts.reduce((sum, w) => sum + w.calories, 0);
    const completedGoals = goals.filter(g => g.status === 'Đã đạt').length;
    const goalPercent = goals.length > 0 ? (completedGoals / goals.length) * 100 : 0;
    return { totalCalo, totalWorkout: workouts.length, goalPercent };
  }, [workouts, goals]);

  // Data cho biểu đồ
  const weightData = healths.map(h => ({ date: h.date, weight: h.weight }));
  const workoutChartData = [
    { week: 'Tuần 1', count: 3 },
    { week: 'Tuần 2', count: 5 },
    { week: 'Tuần 3', count: 2 },
    { week: 'Tuần 4', count: 4 },
  ];

  // ===== RENDER UI =====
  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      
      {/* SECTION 1: DASHBOARD */}
      <Title level={2}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col span={6}><Card><Text type="secondary">Tổng buổi tập</Text><Title level={3}>{dashboardStats.totalWorkout}</Title></Card></Col>
        <Col span={6}><Card><Text type="secondary">Calo đã đốt</Text><Title level={3}>{dashboardStats.totalCalo} kcal</Title></Card></Col>
        <Col span={6}><Card><Text type="secondary">Streak</Text><Title level={3}>5 ngày</Title></Card></Col>
        <Col span={6}><Card><Text type="secondary">Mục tiêu</Text><Progress percent={Math.round(dashboardStats.goalPercent)} /></Card></Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
        <Col span={12}>
          <Card title="Số buổi tập theo tuần">
            <Column data={workoutChartData} xField="week" yField="count" height={200} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Thay đổi cân nặng">
            <Line data={weightData} xField="date" yField="weight" height={200} />
          </Card>
        </Col>
      </Row>

      <Card title="5 buổi tập gần nhất" style={{ marginTop: 20 }}>
        <Timeline
          items={workouts.slice(-5).reverse().map(w => ({
            children: `${w.date}: ${w.name} - ${w.duration} phút (${w.status})`,
            color: w.status === 'Hoàn thành' ? 'green' : 'red'
          }))}
        />
      </Card>

      {/* SECTION 2: NHẬT KÝ TẬP LUYỆN */}
      <Title level={2} style={{ marginTop: 40 }}>Nhật ký tập luyện</Title>
      <Card>
        <Space style={{ marginBottom: 16 }}>
          <Input placeholder="Tìm tên bài tập..." onChange={e => setSearchW(e.target.value)} />
          <Select defaultValue="All" style={{ width: 120 }} onChange={setTypeFilter}>
            <Select.Option value="All">Tất cả</Select.Option>
            <Select.Option value="Cardio">Cardio</Select.Option>
            <Select.Option value="Strength">Strength</Select.Option>
          </Select>
          <RangePicker />
          <Button type="primary" onClick={() => { setEditingWorkout(null); workoutForm.resetFields(); setIsWorkoutModal(true); }}>+ Thêm buổi tập</Button>
        </Space>
        
        <Table
          dataSource={workouts.filter(w => (typeFilter === 'All' || w.type === typeFilter) && w.name.includes(searchW))}
          columns={[
            { title: 'Ngày', dataIndex: 'date' },
            { title: 'Bài tập', dataIndex: 'name' },
            { title: 'Loại', dataIndex: 'type' },
            { title: 'Thời lượng', dataIndex: 'duration', render: (v) => `${v} phút` },
            { title: 'Trạng thái', dataIndex: 'status', render: (s) => <Tag color={s === 'Hoàn thành' ? 'green' : 'volcano'}>{s}</Tag> },
            {
              title: 'Thao tác',
              render: (_, record) => (
                <Space>
                  <Button size="small" onClick={() => {
                    setEditingWorkout(record);
                    workoutForm.setFieldsValue({ ...record, date: dayjs(record.date) });
                    setIsWorkoutModal(true);
                  }}>Sửa</Button>
                  <Popconfirm title="Xóa buổi tập này?" onConfirm={() => setWorkouts(workouts.filter(w => w.id !== record.id))}>
                    <Button size="small" danger>Xóa</Button>
                  </Popconfirm>
                </Space>
              )
            }
          ]}
        />
      </Card>

      {/* SECTION 3: CHỈ SỐ SỨC KHỎE */}
      <Title level={2} style={{ marginTop: 40 }}>Chỉ số sức khỏe</Title>
      <Button type="primary" onClick={() => setIsHealthModal(true)} style={{ marginBottom: 16 }}>+ Ghi chép chỉ số</Button>
      <Table
        dataSource={healths}
        columns={[
          { title: 'Ngày', dataIndex: 'date' },
          { title: 'Cân nặng (kg)', dataIndex: 'weight' },
          { title: 'Chiều cao (cm)', dataIndex: 'height' },
          {
            title: 'BMI',
            render: (_, r) => {
              const bmi = calcBMI(r.weight, r.height);
              return <Space>{bmi.toFixed(1)} {getBMITag(bmi)}</Space>;
            }
          },
          { title: 'Nhịp tim', dataIndex: 'heart' },
          { title: 'Giấc ngủ', dataIndex: 'sleep', render: (v) => `${v}h` }
        ]}
      />

      {/* SECTION 4: QUẢN LÝ MỤC TIÊU */}
      <Title level={2} style={{ marginTop: 40 }}>Mục tiêu</Title>
      <Segmented
        options={['All', 'Đang thực hiện', 'Đã đạt', 'Đã hủy']}
        onChange={(v) => setGoalFilter(v as string)}
        style={{ marginBottom: 16 }}
      />
      <Button type="dashed" block onClick={() => setIsGoalDrawer(true)} style={{ marginBottom: 16 }}>+ Thêm mục tiêu mới</Button>
      
      <Row gutter={[16, 16]}>
        {goals.filter(g => goalFilter === 'All' || g.status === goalFilter).map(g => (
          <Col span={8} key={g.id}>
            <Card title={g.name} extra={<Tag>{g.status}</Tag>}>
              <Text type="secondary">Loại: {g.type} | Hạn: {g.deadline}</Text>
              <Progress percent={Math.round((g.current / g.target) * 100)} status="active" />
              <div style={{ marginTop: 15 }}>
                <Text>Tiến độ hiện tại: </Text>
                <InputNumber 
                  min={0} 
                  value={g.current} 
                  onChange={(val) => setGoals(goals.map(x => x.id === g.id ? {...x, current: val || 0} : x))}
                />
              </div>
              <Popconfirm title="Xóa mục tiêu?" onConfirm={() => setGoals(goals.filter(x => x.id !== g.id))}>
                <Button danger type="text" style={{ marginTop: 10, padding: 0 }}>Xóa mục tiêu</Button>
              </Popconfirm>
            </Card>
          </Col>
        ))}
      </Row>

      {/* SECTION 5: THƯ VIỆN BÀI TẬP */}
      <Title level={2} style={{ marginTop: 40 }}>Thư viện bài tập</Title>
      <Row gutter={[16, 16]}>
        {exercises.map(ex => (
          <Col span={8} key={ex.id}>
            <Card 
              hoverable 
              title={ex.name} 
              extra={<Tag color="blue">{ex.level}</Tag>}
              onClick={() => setIsExDetail(ex)}
            >
              <p><b>Nhóm cơ:</b> {ex.muscle}</p>
              <p>{ex.desc.substring(0, 50)}...</p>
              <Text type="warning">{ex.caloriesPerHour} kcal/giờ</Text>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ===== MODALS & DRAWERS ===== */}
      
      {/* Workout Form Modal */}
      <Modal 
        title={editingWorkout ? "Sửa buổi tập" : "Thêm buổi tập mới"} 
        open={isWokoutModal} 
        onOk={() => workoutForm.submit()} 
        onCancel={() => setIsWorkoutModal(false)}
      >
        <Form form={workoutForm} layout="vertical" onFinish={(v) => {
          const data = { ...v, id: editingWorkout?.id || Date.now().toString(), date: v.date.format('YYYY-MM-DD') };
          setWorkouts(editingWorkout ? workouts.map(w => w.id === data.id ? data : w) : [...workouts, data]);
          setIsWorkoutModal(false);
        }}>
          <Form.Item name="name" label="Tên bài tập" rules={[{ required: true }]}><Input /></Form.Item>
          <Row gutter={10}>
            <Col span={12}><Form.Item name="date" label="Ngày"><DatePicker style={{width:'100%'}}/></Form.Item></Col>
            <Col span={12}><Form.Item name="type" label="Loại"><Select options={[{value:'Cardio'},{value:'Strength'},{value:'Yoga'}]}/></Form.Item></Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}><Form.Item name="duration" label="Thời lượng (phút)"><InputNumber style={{width:'100%'}}/></Form.Item></Col>
            <Col span={12}><Form.Item name="calories" label="Calo đốt cháy"><InputNumber style={{width:'100%'}}/></Form.Item></Col>
          </Row>
          <Form.Item name="status" label="Trạng thái"><Select options={[{value:'Hoàn thành'},{value:'Bỏ lỡ'}]}/></Form.Item>
          <Form.Item name="note" label="Ghi chú"><Input.TextArea /></Form.Item>
        </Form>
      </Modal>

      {/* Goal Drawer */}
      <Drawer title="Tạo mục tiêu mới" open={isGoalDrawer} onClose={() => setIsGoalDrawer(false)} width={400}>
        <Form form={goalForm} layout="vertical" onFinish={(v) => {
          setGoals([...goals, { ...v, id: Date.now().toString(), current: 0, status: 'Đang thực hiện', deadline: v.deadline.format('YYYY-MM-DD') }]);
          setIsGoalDrawer(false);
          goalForm.resetFields();
        }}>
          <Form.Item name="name" label="Tên mục tiêu"><Input /></Form.Item>
          <Form.Item name="type" label="Loại mục tiêu"><Select options={[{value:'Giảm cân'},{value:'Tăng cơ'},{value:'Sức bền'}]}/></Form.Item>
          <Form.Item name="target" label="Giá trị mục tiêu"><InputNumber style={{width:'100%'}}/></Form.Item>
          <Form.Item name="deadline" label="Hạn chót"><DatePicker style={{width:'100%'}}/></Form.Item>
          <Button type="primary" htmlType="submit" block>Lưu mục tiêu</Button>
        </Form>
      </Drawer>

      {/* Exercise Detail Modal */}
      <Modal title="Chi tiết bài tập" open={!!isExDetail} onCancel={() => setIsExDetail(null)} footer={null}>
        {isExDetail && (
          <div>
            <Title level={4}>{isExDetail.name}</Title>
            <Tag color="purple">{isExDetail.muscle}</Tag>
            <p style={{ marginTop: 15 }}>{isExDetail.desc}</p>
            <Text strong>Calo tiêu thụ trung bình: {isExDetail.caloriesPerHour} kcal/giờ</Text>
          </div>
        )}
      </Modal>

      {/* Health Modal */}
      <Modal title="Chỉ số sức khỏe" open={isHealthModal} onCancel={() => setIsHealthModal(false)} onOk={() => healthForm.submit()}>
        <Form form={healthForm} layout="vertical" onFinish={(v) => {
          setHealths([...healths, { ...v, id: Date.now().toString(), date: v.date.format('YYYY-MM-DD') }]);
          setIsHealthModal(false);
        }}>
          <Form.Item name="date" label="Ngày"><DatePicker /></Form.Item>
          <Row gutter={10}>
            <Col span={12}><Form.Item name="weight" label="Cân nặng (kg)"><InputNumber /></Form.Item></Col>
            <Col span={12}><Form.Item name="height" label="Chiều cao (cm)"><InputNumber /></Form.Item></Col>
          </Row>
          <Row gutter={10}>
            <Col span={12}><Form.Item name="heart" label="Nhịp tim (bpm)"><InputNumber /></Form.Item></Col>
            <Col span={12}><Form.Item name="sleep" label="Giờ ngủ"><InputNumber /></Form.Item></Col>
          </Row>
        </Form>
      </Modal>

    </div>
  );
}