import React, { useEffect, useState } from "react";
import { FaBox, FaBullhorn, FaClipboardList, FaSpinner } from "react-icons/fa";
import { MdNewReleases } from "react-icons/md";
import { Pie, Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import LoadingComponent from "../components/LoadingComponent";

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Home = () => {
  const [applications, setApplications] = useState([]);
  const [products, setProducts] = useState([]);
  const [advertising, setAdvertising] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();

  const requestApplications = async () => {
    try {
      const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/zayavka/");
      const result = await response.json();
      if (Array.isArray(result.data)) {
        setApplications(result.data);
        setFilteredApplications(result.data);
        updateNotifications(result.data, "applications");
      }
    } catch (e) {
      console.log("ERROR: ", e);
    } finally {
      setLoading(false);
    }
  };

  const requestProducts = async () => {
    try {
      const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/card");
      const data = await response.json();
      setProducts(data);
      updateNotifications(data, "products");
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const requestAdvertising = async () => {
    try {
      const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/banner");
      const ads = await response.json();
      setAdvertising(ads);
      updateNotifications(ads, "advertising");
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const requestNews = async () => {
    try {
      const response = await fetch("https://admin-dash-oil-trade.onrender.com/api/v1/news/");
      const newsData = await response.json();
      setNews(newsData);
      updateNotifications(newsData, "news");
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const updateNotifications = (data, type) => {
    const recentAdditions = data.slice(-3).map((item) => ({
      type,
      name: item.name || item.title || "New Item",
      date: item.date || new Date().toISOString(),
    }));
    setNotifications((prev) => [...prev, ...recentAdditions]);
  };

  useEffect(() => {
    requestApplications();
    requestProducts();
    requestAdvertising();
    requestNews();
  }, []);

  const handleFilter = () => {
    const start = startDate ? new Date(startDate) : new Date("1970-01-01");
    const end = endDate ? new Date(endDate) : new Date();
    const filtered = applications.filter((app) => {
      const appDate = new Date(app.date);
      return appDate >= start && appDate <= end;
    });
    setFilteredApplications(filtered);
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const goToNotifications = () => {
    navigate("/app/notifications", { state: { notifications } });
  };

  const doughnutData = {
    labels: ["Продукты", "Реклама", "Новости"],
    datasets: [
      {
        data: [products.length, advertising.length, news.length],
        backgroundColor: ["#3B82F6", "#36A2EB", "#FFCE56"],
        hoverBackgroundColor: ["#1E3A8A", "#2563EB", "#F59E0B"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "75%",
    plugins: {
      tooltip: {
        enabled: true,
      },
    },
    maintainAspectRatio: false,
  };

  const barData = {
    labels: filteredApplications.map((app) =>
      new Date(app.date).toLocaleDateString()
    ),
    datasets: [
      {
        label: "Заявки со временем",
        data: filteredApplications.map((app) => app.amount || 1),
        backgroundColor: "rgba(75,192,192,0.6)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="w-full h-full bg-gray-50 text-black p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
      </div>
      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div
              className="p-6 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate("/app/products")}
            >
              <div className="flex justify-between items-center">
                <FaBox size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{products.length}</p>
                  <p className="text-sm">Ассортимент товаров</p>
                </div>
              </div>
            </div>

            <div
              className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate("/app/applications")}
            >
              <div className="flex justify-between items-center">
                <FaClipboardList size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{applications.length}</p>
                  <p className="text-sm">Всего заявок</p>
                </div>
              </div>
            </div>

            <div
              className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate("/app/advertising")}
            >
              <div className="flex justify-between items-center">
                <FaBullhorn size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{advertising.length}</p>
                  <p className="text-sm">Активная реклама</p>
                </div>
              </div>
            </div>

            <div
              className="p-6 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 cursor-pointer"
              onClick={() => handleNavigate("/app/news")}
            >
              <div className="flex justify-between items-center">
                <MdNewReleases size={30} />
                <div className="text-right">
                  <p className="text-3xl font-bold">{news.length}</p>
                  <p className="text-sm">Новости</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 mb-6 p-4 bg-white rounded-lg shadow-md text-white">
            <h2 className="text-2xl font-semibold mb-4 text-black">
              Фильтр заявок по дате
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2">Дата начала:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-2 border rounded-lg w-full bg-slate-600"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Дата окончания:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-2 border rounded-lg w-full bg-slate-600"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleFilter}
                  className="bg-blue-500 text-white py-3 px-6 rounded-lg w-full hover:bg-blue-600 transition-colors"
                >
                  Применить фильтр
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Заявки со временем</h2>
              {filteredApplications.length > 0 ? (
                <Bar data={barData} />
              ) : (
                <p>Нет доступных данных</p>
              )}
            </div>

            <div className="p-6 bg-white text-black rounded-lg shadow-md hover:shadow-lg transition-transform duration-300 transform hover:scale-105 flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-4">Распределение данных</h2>
              <div className="relative w-[500px] h-[500px]">
                <Doughnut data={doughnutData} options={doughnutOptions} />
                <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                  <p className="text-xl font-bold text-center">
                    Распределение данных
                  </p>
                  <p className="text-sm text-center">Продукты: {products.length}</p>
                  <p className="text-sm text-center">Реклама: {advertising.length}</p>
                  <p className="text-sm text-center">Новости: {news.length}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
