// Booking System JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Sample data - in real app this would come from backend
  const sampleBookings = {
    "2024-01-15": ["10:00", "14:00"],
    "2024-01-16": ["11:00", "15:00"],
    "2024-01-17": ["10:30", "16:00"],
  };

  let currentWeekStart = new Date();
  let selectedDate = null;
  let selectedTime = null;

  // Get current week's Monday
  function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Format date for display
  function formatDate(date) {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  // Format date for comparison
  function formatDateKey(date) {
    return date.toISOString().split("T")[0];
  }

  // Check if date is today or future
  function isFutureDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }

  // Generate time slots
  function generateTimeSlots(period) {
    const slots = [];
    let start, end, increment;

    switch (period) {
      case "morning":
        start = 10;
        end = 12;
        increment = 0.5;
        break;
      case "afternoon":
        start = 14;
        end = 17;
        increment = 0.5;
        break;
      case "evening":
        start = 18;
        end = 20;
        increment = 0.5;
        break;
    }

    for (let hour = start; hour < end; hour += increment) {
      const wholeHour = Math.floor(hour);
      const minutes = (hour % 1) * 60;
      const timeString = `${wholeHour.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      slots.push(timeString);
    }

    return slots;
  }

  // Check if slot is booked
  function isSlotBooked(date, time) {
    const dateKey = formatDateKey(date);
    return sampleBookings[dateKey] && sampleBookings[dateKey].includes(time);
  }

  // Render date picker
  function renderDatePicker() {
    const datePicker = document.getElementById("datePicker");
    const weekStart = getMonday(currentWeekStart);

    datePicker.innerHTML = "";

    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + i);

      const dateCard = document.createElement("div");
      dateCard.className = "date-card";

      if (!isFutureDate(date)) {
        dateCard.classList.add("disabled");
      }

      if (selectedDate && formatDateKey(date) === formatDateKey(selectedDate)) {
        dateCard.classList.add("selected");
      }

      dateCard.innerHTML = `
        <div class="date-day">${date.toLocaleDateString("en-US", {
          weekday: "short",
        })}</div>
        <div class="date-number">${date.getDate()}</div>
      `;

      if (isFutureDate(date)) {
        dateCard.addEventListener("click", () => {
          document
            .querySelectorAll(".date-card")
            .forEach((card) => card.classList.remove("selected"));
          dateCard.classList.add("selected");
          selectedDate = date;
          selectedTime = null;
          renderTimeSlots();
          updateSelectedSlotInfo();
        });
      }

      datePicker.appendChild(dateCard);
    }
  }

  // Render time slots
  function renderTimeSlots() {
    if (!selectedDate) return;

    const periods = ["morning", "afternoon", "evening"];

    periods.forEach((period) => {
      const container = document.getElementById(`${period}Slots`);
      container.innerHTML = "";

      const slots = generateTimeSlots(period);

      slots.forEach((time) => {
        const slotItem = document.createElement("div");
        slotItem.className = "slot-item";

        const isBooked = isSlotBooked(selectedDate, time);

        if (isBooked) {
          slotItem.classList.add("booked");
        }

        if (selectedTime === time && !isBooked) {
          slotItem.classList.add("selected");
        }

        slotItem.innerHTML = `
          <div class="slot-time">${time}</div>
          <div class="slot-status">${isBooked ? "Booked" : "Available"}</div>
        `;

        if (!isBooked) {
          slotItem.addEventListener("click", () => {
            document
              .querySelectorAll(".slot-item")
              .forEach((slot) => slot.classList.remove("selected"));
            slotItem.classList.add("selected");
            selectedTime = time;
            updateSelectedSlotInfo();
          });
        }

        container.appendChild(slotItem);
      });
    });
  }

  // Update selected slot info
  function updateSelectedSlotInfo() {
    const slotDetails = document.getElementById("slotDetails");

    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      slotDetails.textContent = `${dateStr} at ${selectedTime}`;
    } else if (selectedDate) {
      slotDetails.textContent = "Date selected - Please choose a time";
    } else {
      slotDetails.textContent = "Please select a date and time";
    }
  }

  // Calendar navigation
  document.getElementById("prevWeek").addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateWeekDisplay();
    renderDatePicker();
  });

  document.getElementById("nextWeek").addEventListener("click", () => {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateWeekDisplay();
    renderDatePicker();
  });

  function updateWeekDisplay() {
    const currentWeekEl = document.getElementById("currentWeek");
    const weekStart = getMonday(currentWeekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    currentWeekEl.textContent = `${formatDate(weekStart)} - ${formatDate(
      weekEnd,
    )}`;
  }

  // Form submission
  document
    .getElementById("bookingForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      if (!selectedDate || !selectedTime) {
        alert("Please select a date and time for your appointment.");
        return;
      }

      // Get form data
      const formData = new FormData(this);
      const bookingData = {
        patientName: formData.get("patientName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        age: formData.get("age"),
        reason: formData.get("reason"),
        symptoms: formData.get("symptoms"),
        date: selectedDate,
        time: selectedTime,
      };

      // Validate required fields
      if (
        !bookingData.patientName ||
        !bookingData.phone ||
        !bookingData.reason
      ) {
        alert("Please fill in all required fields.");
        return;
      }

      // Validate phone number
      if (!window.validatePhone(bookingData.phone)) {
        alert("Please enter a valid phone number.");
        return;
      }

      // Validate email if provided
      if (bookingData.email && !window.validateEmail(bookingData.email)) {
        alert("Please enter a valid email address.");
        return;
      }

      // Simulate booking submission
      addLoadingState(e.target.querySelector('button[type="submit"]'));

      // In real app, this would be an API call
      setTimeout(() => {
        // Add booking to sample data
        const dateKey = formatDateKey(selectedDate);
        if (!sampleBookings[dateKey]) {
          sampleBookings[dateKey] = [];
        }
        sampleBookings[dateKey].push(selectedTime);

        showConfirmationModal(bookingData);
        this.reset();
        selectedDate = null;
        selectedTime = null;
        updateSelectedSlotInfo();
        renderTimeSlots();
      }, 2000);
    });

  // Show confirmation modal
  function showConfirmationModal(bookingData) {
    const modal = document.getElementById("confirmationModal");
    const confirmationDetails = document.getElementById("confirmationDetails");

    const dateStr = bookingData.date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    confirmationDetails.innerHTML = `
      <h3 style="margin-bottom: 16px; color: var(--primary-green);">Booking Confirmed!</h3>
      <p><strong>Patient:</strong> ${bookingData.patientName}</p>
      <p><strong>Date:</strong> ${dateStr}</p>
      <p><strong>Time:</strong> ${bookingData.time}</p>
      <p><strong>Consultation:</strong> ${bookingData.reason}</p>
      <p><strong>Phone:</strong> ${bookingData.phone}</p>
      ${bookingData.email ? `<p><strong>Email:</strong> ${bookingData.email}</p>` : ""}
      <hr style="margin: 16px 0; border: none; border-top: 1px solid var(--border-light);">
      <p style="color: var(--text-muted); font-size: 14px;">
        You will receive a confirmation call within 1 hour. Please arrive 15 minutes early for your appointment.
      </p>
    `;

    modal.classList.add("active");

    // Store booking data for sharing
    window.currentBooking = bookingData;
  }

  // Modal close handlers
  document.getElementById("modalClose").addEventListener("click", () => {
    document.getElementById("confirmationModal").classList.remove("active");
  });

  // Add to calendar
  document.getElementById("addToCalendar").addEventListener("click", () => {
    const booking = window.currentBooking;
    if (!booking) return;

    const startDate = new Date(booking.date);
    const [hours, minutes] = booking.time.split(":");
    startDate.setHours(parseInt(hours), parseInt(minutes));

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + 1); // 1 hour appointment

    const event = {
      title: `Ayurvedic Consultation - Dr. Subrahmanya M N`,
      description: `Consultation for: ${booking.reason}${
        booking.symptoms ? `\nSymptoms: ${booking.symptoms}` : ""
      }\n\nAyur Wellness Center\n123 MG Road, Koramangala\nBangalore, Karnataka 560034\n\nPhone: +91 98765 43210`,
      start: startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
      end: endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z",
    };

    const calendarUrl = `data:text/calendar;charset=utf8,BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:${event.start}
DTEND:${event.end}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:Ayur Wellness Center, 123 MG Road, Koramangala, Bangalore, Karnataka 560034
END:VEVENT
END:VCALENDAR`;

    const link = document.createElement("a");
    link.href = calendarUrl;
    link.download = "appointment.ics";
    link.click();
  });

  // Share on WhatsApp
  document.getElementById("shareWhatsApp").addEventListener("click", () => {
    const booking = window.currentBooking;
    if (!booking) return;

    const dateStr = booking.date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const message = `🌿 *Ayurvedic Consultation Booked!*

📅 *Date:* ${dateStr}
🕐 *Time:* ${booking.time}
👨‍⚕️ *Doctor:* Dr. Subrahmanya M N (BAMS)
🏥 *Clinic:* Ayur Wellness Center

📍 *Address:*
123 MG Road, Koramangala
Bangalore, Karnataka 560034

📞 *Contact:* +91 98765 43210

✨ Looking forward to my Ayurvedic healing journey!`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  });

  // Initialize
  currentWeekStart = getMonday(new Date());
  updateWeekDisplay();
  renderDatePicker();
  updateSelectedSlotInfo();
});
