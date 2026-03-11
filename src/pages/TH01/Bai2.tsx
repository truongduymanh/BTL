import React, { useState, useEffect } from "react";
import {
  Tabs,
  Card,
  Button,
  Table,
  Space,
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";

const { TabPane } = Tabs;

/* ===== LocalStorage ===== */
const getLocal = (key, defaultValue) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : defaultValue;
};

export default function Bai2() {
  /* ================= STATE ================= */
  const [subjects, setSubjects] = useState(getLocal("subjects", []));
  const [schedules, setSchedules] = useState(getLocal("schedules", []));
  const [goals, setGoals] = useState(getLocal("goals", {}));

  const [subjectModal, setSubjectModal] = useState(false);
  const [scheduleModal, setScheduleModal] = useState(false);

  const [editingSubject, setEditingSubject] = useState(null);
  const [editingSchedule, setEditingSchedule] = useState(null);

  const [subjectForm] = Form.useForm();
  const [scheduleForm] = Form.useForm();
  const [goalForm] = Form.useForm();

  /* ================= SAVE LOCAL ================= */
  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("schedules", JSON.stringify(schedules));
  }, [schedules]);

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify(goals));
  }, [goals]);

  /* ================= SUBJECT ================= */

  const handleAddSubject = () => {
    setEditingSubject(null);
    subjectForm.resetFields();
    setSubjectModal(true);
  };

  const handleSaveSubject = async () => {
    try {
      const values = await subjectForm.validateFields();

      if (editingSubject) {
        setSubjects(
          subjects.map((s) =>
            s.id === editingSubject.id ? { ...s, name: values.name } : s
          )
        );
      } else {
        setSubjects([...subjects, { id: Date.now(), name: values.name }]);
      }

      subjectForm.resetFields();
      setEditingSubject(null);
      setSubjectModal(false);
      message.success("Lưu môn học thành công");
    } catch {}
  };

  const deleteSubject = (id) => {
    setSubjects(subjects.filter((s) => s.id !== id));
    setSchedules(schedules.filter((s) => s.subjectId !== id));
    message.success("Đã xóa môn học");
  };

  /* ================= SCHEDULE ================= */

  const handleAddSchedule = () => {
    if (subjects.length === 0) {
      message.warning("Vui lòng thêm môn học trước");
      return;
    }
    setEditingSchedule(null);
    scheduleForm.resetFields();
    setScheduleModal(true);
  };

  const handleSaveSchedule = async () => {
    try {
      const values = await scheduleForm.validateFields();

      const newData = {
        id: editingSchedule ? editingSchedule.id : Date.now(),
        subjectId: values.subjectId,
        datetime: values.datetime.format(),
        duration: values.duration,
        content: values.content,
        note: values.note,
      };

      if (editingSchedule) {
        setSchedules(
          schedules.map((s) =>
            s.id === editingSchedule.id ? newData : s
          )
        );
      } else {
        setSchedules([...schedules, newData]);
      }

      scheduleForm.resetFields();
      setEditingSchedule(null);
      setScheduleModal(false);
      message.success("Lưu lịch học thành công");
    } catch {}
  };

  const deleteSchedule = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
    message.success("Đã xóa lịch học");
  };

  /* ================= GOAL ================= */

  const handleSaveGoal = async () => {
    try {
      const values = await goalForm.validateFields();

      setGoals({
        month: values.month.format("YYYY-MM"),
        totalGoal: values.totalGoal,
      });

      message.success("Lưu mục tiêu thành công");
    } catch {}
  };

  const totalHours = schedules
    .filter(
      (s) =>
        goals.month &&
        dayjs(s.datetime).format("YYYY-MM") === goals.month
    )
    .reduce((sum, s) => sum + s.duration, 0);

  /* ================= TABLE ================= */

  const subjectColumns = [
    { title: "Tên môn học", dataIndex: "name" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingSubject(record);
              subjectForm.setFieldsValue(record);
              setSubjectModal(true);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => deleteSubject(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const scheduleColumns = [
    {
      title: "Môn học",
      render: (_, record) =>
        subjects.find((s) => s.id === record.subjectId)?.name,
    },
    {
      title: "Thời gian",
      render: (_, r) =>
        dayjs(r.datetime).format("DD/MM/YYYY HH:mm"),
    },
    { title: "Thời lượng (giờ)", dataIndex: "duration" },
    { title: "Nội dung", dataIndex: "content" },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            onClick={() => {
              setEditingSchedule(record);
              scheduleForm.setFieldsValue({
                ...record,
                datetime: dayjs(record.datetime),
              });
              setScheduleModal(true);
            }}
          >
            Sửa
          </Button>
          <Button danger onClick={() => deleteSchedule(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  /* ================= UI ================= */

  return (
    <Card title="QUẢN LÝ HỌC TẬP">
      <Tabs defaultActiveKey="1">

        <TabPane tab="Danh mục môn học" key="1">
          <Button type="primary" onClick={handleAddSubject}>
            + Thêm môn học
          </Button>
          <Table
            columns={subjectColumns}
            dataSource={subjects}
            rowKey="id"
            style={{ marginTop: 20 }}
          />
        </TabPane>

        <TabPane tab="Lịch học" key="2">
          <Button type="primary" onClick={handleAddSchedule}>
            + Thêm lịch học
          </Button>
          <Table
            columns={scheduleColumns}
            dataSource={schedules}
            rowKey="id"
            style={{ marginTop: 20 }}
          />
        </TabPane>

        <TabPane tab="Mục tiêu tháng" key="3">
          <Form form={goalForm} layout="vertical">
            <Form.Item
              name="month"
              label="Chọn tháng"
              rules={[{ required: true }]}
            >
              <DatePicker picker="month" />
            </Form.Item>

            <Form.Item
              name="totalGoal"
              label="Tổng giờ mục tiêu"
              rules={[{ required: true }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>

            <Button type="primary" onClick={handleSaveGoal}>
              Lưu mục tiêu
            </Button>
          </Form>

          {goals.month && (
            <Card style={{ marginTop: 20 }}>
              <p>Tháng: {goals.month}</p>
              <p>Tổng giờ đã học: {totalHours}</p>
              <p>
                Trạng thái:{" "}
                {totalHours >= goals.totalGoal
                  ? "✅ Đã đạt"
                  : "❌ Chưa đạt"}
              </p>
            </Card>
          )}
        </TabPane>

      </Tabs>

      {/* SUBJECT MODAL */}
      <Modal
        title={editingSubject ? "Sửa môn học" : "Thêm môn học"}
        visible={subjectModal}
        onOk={handleSaveSubject}
        onCancel={() => {
          subjectForm.resetFields();
          setEditingSubject(null);
          setSubjectModal(false);
        }}
      >
        <Form form={subjectForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên môn học"
            rules={[{ required: true, message: "Nhập tên môn học" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* SCHEDULE MODAL */}
      <Modal
        title={editingSchedule ? "Sửa lịch học" : "Thêm lịch học"}
        visible={scheduleModal}
        onOk={handleSaveSchedule}
        onCancel={() => {
          scheduleForm.resetFields();
          setEditingSchedule(null);
          setScheduleModal(false);
        }}
      >
        <Form form={scheduleForm} layout="vertical">
          <Form.Item
            name="subjectId"
            label="Môn học"
            rules={[{ required: true }]}
          >
            <Select placeholder="Chọn môn học">
              {subjects.map((s) => (
                <Select.Option key={s.id} value={s.id}>
                  {s.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="datetime"
            label="Thời gian"
            rules={[{ required: true }]}
          >
            <DatePicker showTime style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="duration"
            label="Thời lượng (giờ)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="content" label="Nội dung">
            <Input />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
