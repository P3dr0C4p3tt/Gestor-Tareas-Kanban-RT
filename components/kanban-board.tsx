"use client";

import { useState, useEffect, useMemo } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { CreateCardForm } from "./create-card-form";
import { CardModal } from "./card-modal";
import { CreateColumnForm } from "./create-column-form";
import { updateCardOrder } from "@/app/actions/card-actions";
import { deleteColumn } from "@/app/actions/column-actions";

interface Card {
  id: string;
  title: string;
  description?: string | null;
  order?: number;
  columnId: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  labelColor?: string | null;
  dueDate?: string | Date | null;
}

interface Column {
  id: string;
  name: string;
  cards: Card[];
}

interface KanbanBoardProps {
  boardId: string;
  initialColumns: Column[];
  userRole?: "OWNER" | "MEMBER" | "VIEWER";
}
  
const PRIORITY_BADGES = {
  LOW: { label: "Baja", bg: "bg-gray-100 text-gray-600" },
  MEDIUM: { label: "Media", bg: "bg-blue-50 text-blue-600" },
  HIGH: { label: "Alta", bg: "bg-orange-50 text-orange-600" },
  URGENT: { label: "Urgente", bg: "bg-red-50 text-red-600 font-bold" },
};

export function KanbanBoard({ boardId, initialColumns, userRole = "MEMBER", }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const isEditor = userRole === "OWNER" || userRole === "MEMBER";

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState<string>("ALL");

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const filteredColumns = useMemo(() => {
    return columns.map((col) => ({
      ...col,
      cards: col.cards.filter((card) => {
        const matchesSearch = card.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());

        const matchesPriority =
          selectedPriority === "ALL" || card.priority === selectedPriority;

        return matchesSearch && matchesPriority;
      }),
    }));
  }, [columns, searchQuery, selectedPriority]);

  function getDueDateBadge(dueDateString?: string | Date | null) {
      if (!dueDateString) return null;

      const dueDate = new Date(dueDateString);
      
      dueDate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isExpired = dueDate < today;
      const isToday = dueDate.getTime() === today.getTime();

      let styles = "bg-gray-100 text-gray-600";
      if (isExpired) {
        styles = "bg-red-100 text-red-700 font-medium";
      } else if (isToday) {
        styles = "bg-amber-100 text-amber-700 font-medium";
      }

      const formatted = dueDate.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
      });

      return (
        <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1 ${styles}`}>
          📅 {formatted} {isExpired ? "(Vencida)" : isToday ? "(Hoy)" : ""}
        </span>
      );
    }

  const handleCardUpdated = (updatedCard: Card) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        cards: col.cards.map((c) => (c.id === updatedCard.id ? updatedCard : c)),
      }))
    );
  };

  const handleDeleteColumn = async (columnId: string) => {
    if (!confirm("¿Seguro que deseas borrar esta columna? Se eliminarán todas sus tarjetas.")) {
      return;
    }

    const result = await deleteColumn(columnId, boardId);
    if (result.success) {
      setColumns((prev) => prev.filter((col) => col.id !== columnId));
    } else {
      alert(result.error);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newColumns = Array.from(columns);
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId);
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId);

    const sourceCol = newColumns[sourceColIndex];
    const destCol = newColumns[destColIndex];

    const sourceCards = Array.from(sourceCol.cards);
    const [movedCard] = sourceCards.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceCards.splice(destination.index, 0, movedCard);
      const updatedCards = sourceCards.map((card, idx) => ({ ...card, order: idx }));
      newColumns[sourceColIndex].cards = updatedCards;

      setColumns(newColumns);
      await updateCardOrder(
        updatedCards.map((c) => ({ id: c.id, order: c.order, columnId: c.columnId })),
        boardId
      );
    } else {
      const destCards = Array.from(destCol.cards);
      movedCard.columnId = destination.droppableId;
      destCards.splice(destination.index, 0, movedCard);

      const updatedSourceCards = sourceCards.map((card, idx) => ({ ...card, order: idx }));
      const updatedDestCards = destCards.map((card, idx) => ({ ...card, order: idx }));

      newColumns[sourceColIndex].cards = updatedSourceCards;
      newColumns[destColIndex].cards = updatedDestCards;

      setColumns(newColumns);

      const payload = [...updatedSourceCards, ...updatedDestCards].map((c) => ({
        id: c.id,
        order: c.order,
        columnId: c.columnId,
      }));

      await updateCardOrder(payload, boardId);

    }
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap gap-4 items-center justify-between bg-white p-3 rounded-lg border shadow-sm">
        <div className="flex items-center gap-3 flex-1 min-w-60">
          <span className="text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Buscar tarjetas por título..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Prioridad:
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="text-xs border rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 text-gray-700"
          >
            <option value="ALL">Todas</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
            <option value="URGENT">Urgente</option>
          </select>
        </div>
      </div>

      <DragDropContext onDragEnd={isEditor ? onDragEnd : () => {}}>
        <div className="flex gap-6 items-start h-full min-w-max">
          {filteredColumns.map((column) => (
            <div
              key={column.id}
              className="w-72 bg-gray-200/70 rounded-lg p-3 flex flex-col max-h-full border border-gray-300/50"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-700 text-sm">{column.name}</h3>
                  <span className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded-full font-medium">
                    {column.cards.length}
                  </span>
                </div>

                {isEditor && (
                  <button
                    onClick={() => handleDeleteColumn(column.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors text-xs p-1"
                    title="Eliminar columna"
                  >
                    ✕
                  </button>
                )}
              </div>

              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-2 flex-1 overflow-y-auto min-h-12.5"
                  >
                    {column.cards.map((card, index) => (
                      <Draggable
                        key={card.id}
                        draggableId={card.id}
                        index={index}
                        isDragDisabled={!isEditor} // 2. Deshabilitar arrastre de tarjetas para VIEWER
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => isEditor && setSelectedCard(card)}
                            className={`bg-white rounded shadow-sm text-sm text-gray-800 border overflow-hidden ${
                              isEditor ? "cursor-pointer hover:border-blue-400" : "cursor-default"
                            } transition-colors ${
                              snapshot.isDragging ? "shadow-md ring-2 ring-blue-400" : ""
                            }`}
                          >
                            {card.labelColor && (
                              <div
                                className="h-2 w-full"
                                style={{ backgroundColor: card.labelColor }}
                              />
                            )}
                            {card.dueDate && (
                              <div className="mt-2 flex items-center">
                                {getDueDateBadge(card.dueDate)}
                              </div>
                            )}
                            <div className="p-3">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="font-medium leading-snug">{card.title}</p>
                                {card.priority && (
                                  <span
                                    className={`text-[10px] px-1.5 py-0.5 rounded ${
                                      PRIORITY_BADGES[card.priority]?.bg
                                    }`}
                                  >
                                    {PRIORITY_BADGES[card.priority]?.label}
                                  </span>
                                )}
                              </div>

                              {card.description && (
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                  {card.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {isEditor && <CreateCardForm columnId={column.id} boardId={boardId} />}
            </div>
          ))}

          {/* 5. Ocultar el formulario de creación de columnas */}
          {isEditor && <CreateColumnForm boardId={boardId} />}
        </div>
      </DragDropContext>

      {selectedCard && (
        <CardModal
          card={selectedCard}
          boardId={boardId}
          isOpen={!!selectedCard}
          onClose={() => setSelectedCard(null)}
          onCardUpdated={(updatedCard) => handleCardUpdated(updatedCard as Card)}
        />
      )}
    </>
  )}