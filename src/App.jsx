import { useState, useEffect } from 'react'
import { CarCard } from './components/CarCard'
import { AddCarForm } from './components/AddCarForm'
import { Summary } from './components/Summary'
import { loadCars, saveCars } from './storage'
import './App.css'

export default function App() {
  const [cars, setCars] = useState([])

  useEffect(() => {
    setCars(loadCars())
  }, [])

  useEffect(() => {
    if (cars.length) saveCars(cars)
  }, [cars])

  const addCar = (brand, model, price) => {
    setCars(prev => [...prev, {
      id: crypto.randomUUID(),
      brand: brand.trim(),
      model: model.trim(),
      price: Number(price) || 0,
      expenses: [],
    }])
  }

  const addExpense = (carId, amount, comment) => {
    setCars(prev => prev.map(car =>
      car.id === carId
        ? {
            ...car,
            expenses: [...car.expenses, {
              id: crypto.randomUUID(),
              amount: Number(amount) || 0,
              comment: (comment || '').trim(),
              date: new Date().toISOString(),
            }],
          }
        : car
    ))
  }

  const removeExpense = (carId, expenseId) => {
    setCars(prev => prev.map(car =>
      car.id === carId
        ? { ...car, expenses: car.expenses.filter(e => e.id !== expenseId) }
        : car
    ))
  }

  const removeCar = (carId) => {
    if (confirm('Удалить авто и все расходы?')) setCars(prev => prev.filter(c => c.id !== carId))
  }

  return (
    <div className="app">
      <header className="header">
        <h1>MIbisnes</h1>
        <p className="tagline">Учёт расходов — детейлинг</p>
      </header>

      <main className="main">
        <AddCarForm onSubmit={addCar} />
        <Summary cars={cars} />
        <section className="cars">
          {cars.map(car => (
            <CarCard
              key={car.id}
              car={car}
              onAddExpense={addExpense}
              onRemoveExpense={removeExpense}
              onRemoveCar={removeCar}
            />
          ))}
        </section>
      </main>
    </div>
  )
}
