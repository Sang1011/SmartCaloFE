export function getVietnameseDateString() {
    const date = new Date();
  
    // Danh sách thứ bằng tiếng Việt
    const days = [
      "Chủ nhật",
      "Thứ 2",
      "Thứ 3",
      "Thứ 4",
      "Thứ 5",
      "Thứ 6",
      "Thứ 7",
    ];
  
    const dayOfWeek = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1; // tháng bắt đầu từ 0
  
    return `${dayOfWeek}, ${day} tháng ${month}`;
  }