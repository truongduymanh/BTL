import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Table, Tag, Modal, 
  Form, Input, Select, DatePicker, Typography, Space, Empty 
} from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

// --- Định nghĩa Interface ---
interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string;
  priority: 'Cao' | 'Trung bình' | 'Thấp';
  status: 'todo' | 'inProgress' | 'done';
  tags: string[];
}

const KanbanApp = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kanban_v3_data');
    return saved ? JSON.parse(saved) : [];
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [form] = Form.useForm();

  // Lưu trữ dữ liệu vào localStorage
  useEffect(() => {
    localStorage.setItem('kanban_v3_data', JSON.stringify(tasks));
  }, [tasks]);

  // --- Xử lý Kéo thả (react-beautiful-dnd) ---
  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedTasks = [...tasks];
    const taskIndex = updatedTasks.findIndex(t => t.id === draggableId);
    
    // Cập nhật trạng thái mới cho task khi sang cột khác
    if (taskIndex !== -1) {
      updatedTasks[taskIndex].status = destination.droppableId as any;
      setTasks(updatedTasks);
    }
  };

  // --- Thêm Task mới ---
  const handleAddTask = (values: any) => {
    const newTask: Task = {
      ...values,
      id: `task-${Date.now()}`,
      deadline: values.deadline.format('YYYY-MM-DD'),
      status: 'todo',
      tags: values.tags ? values.tags.split(',').map((t: string) => t.trim()) : [],
    };
    setTasks([...tasks, newTask]);
    setIsModalOpen(false);
    form.resetFields();
  };

  // --- Thống kê Dashboard ---
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => dayjs(t.deadline).isBefore(dayjs(), 'day') && t.status !== 'done').length,
  };

  // --- Cấu hình Table Danh sách ---
  const columnsTable = [
    { title: 'Tên', dataIndex: 'title', key: 'title', sorter: (a: Task, b: Task) => a.title.localeCompare(b.title) },
    { title: 'Deadline', dataIndex: 'deadline', key: 'deadline', sorter: (a: Task, b: Task) => dayjs(a.deadline).unix() - dayjs(b.deadline).unix() },
    { 
      title: 'Trạng thái', 
      dataIndex: 'status', 
      render: (s: string) => (
        <Tag color={s === 'done' ? 'green' : s === 'inProgress' ? 'blue' : 'orange'}>
          {s === 'todo' ? 'Cần làm' : s === 'inProgress' ? 'Đang làm' : 'Hoàn thành'}
        </Tag>
      ) 
    },
    { 
      title: 'Ưu tiên', 
      dataIndex: 'priority', 
      render: (p: string) => {
        let color = p === 'Cao' ? 'red' : p === 'Trung bình' ? 'gold' : 'blue';
        return <Tag color={color}>{p}</Tag>;
      } 
    },
  ];

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchText.toLowerCase()) && 
    (filterStatus === 'All' || t.status === filterStatus)
  );

  return (
    <div style={{ padding: '24px', background: '#f5f7f9', minHeight: '100vh' }}>
      
      {/* 1. TRANG DASHBOARD */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}><Card bordered={false} style={{borderRadius: 0}}>Tổng task: {stats.total}</Card></Col>
        <Col span={8}><Card bordered={false} style={{borderRadius: 0}}>Hoàn thành: {stats.completed}</Card></Col>
        <Col span={8}><Card bordered={false} style={{borderRadius: 0}}>Quá hạn: {stats.overdue}</Card></Col>
      </Row>

      <Button 
        type="primary" 
        danger 
        icon={<PlusOutlined />} 
        onClick={() => setIsModalOpen(true)}
        style={{ marginBottom: 24, borderRadius: '2px', height: '40px' }}
      >
        + Thêm task
      </Button>

      {/* 2. TRANG KANBAN BOARD */}
      <Title level={4}>KANBAN</Title>
      <DragDropContext onDragEnd={onDragEnd}>
        <Row gutter={16} style={{ marginBottom: 40 }}>
          {[
            { id: 'todo', name: 'Cần làm' },
            { id: 'inProgress', name: 'Đang làm' },
            { id: 'done', name: 'Hoàn thành' }
          ].map(col => (
            <Col span={8} key={col.id}>
              <div style={{ background: '#fff', padding: '16px', minHeight: '180px', border: '1px solid #f0f0f0' }}>
                <div style={{ fontWeight: 'bold', marginBottom: 16 }}>{col.name}</div>
                <Droppable droppableId={col.id}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={{ minHeight: '100px' }}>
                      {tasks.filter(t => t.status === col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={{
                                padding: '12px',
                                marginBottom: '10px',
                                background: '#fafafa',
                                border: '1px solid #eee',
                                borderRadius: '4px',
                                ...provided.draggableProps.style
                              }}
                            >
                              <div style={{fontWeight: 500}}>{task.title}</div>
                              <div style={{fontSize: '11px', color: '#999'}}>{task.deadline}</div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </Col>
          ))}
        </Row>
      </DragDropContext>

      {/* 3. TRANG DANH SÁCH TASK */}
      <Title level={4}>DANH SÁCH</Title>
      <Space style={{ marginBottom: 16 }}>
        <Input 
          placeholder="Search..." 
          prefix={<SearchOutlined />} 
          style={{ width: 220 }} 
          onChange={e => setSearchText(e.target.value)} 
        />
        <Select defaultValue="All" style={{ width: 140 }} onChange={setFilterStatus}>
          <Option value="All">All Status</Option>
          <Option value="todo">Cần làm</Option>
          <Option value="inProgress">Đang làm</Option>
          <Option value="done">Hoàn thành</Option>
        </Select>
      </Space>
      
      <Table 
        columns={columnsTable} 
        dataSource={filteredTasks} 
        rowKey="id" 
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: <Empty description="Trống" /> }}
        style={{ background: '#fff' }}
      />

      {/* FORM THÊM / CHỈNH SỬA TASK */}
      <Modal 
        title="Thêm công việc mới" 
        open={isModalOpen} 
        onCancel={() => setIsModalOpen(false)} 
        onOk={() => form.submit()}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" onFinish={handleAddTask}>
          <Form.Item name="title" label="Tên task" rules={[{ required: true, message: 'Vui lòng nhập tên task!' }]}>
            <Input placeholder="Nhập tên công việc" />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea placeholder="Mô tả chi tiết" />
          </Form.Item>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Chọn hạn chót!' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="priority" label="Ưu tiên" initialValue="Trung bình">
                <Select>
                  <Option value="Cao">Cao</Option>
                  <Option value="Trung bình">Trung bình</Option>
                  <Option value="Thấp">Thấp</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="tags" label="Tags">
            <Input placeholder="Ví dụ: React, Học tập (phân cách bằng dấu phẩy)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KanbanApp;