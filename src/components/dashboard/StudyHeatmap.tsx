"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useHeatmap } from "@/hooks/progress/useHeatmap";
import { motion } from "framer-motion";

const HEATMAP_COLORS = [
  "bg-[#e6e9f5] dark:bg-white/10",
  "bg-[#d9dcf7] dark:bg-[#3a3450]",
  "bg-[#c3c6f2] dark:bg-[#4c4470]",
  "bg-[#9498ea] dark:bg-[#8f7fc7]",
  "bg-[#6f74e8] dark:bg-[#e9a07c]",
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type HeatmapDay = {
  date: string;
  watchedSeconds: number;
  level: number;
};

type WeekMeta = {
  isMonthStart: boolean;
  label: string | null;
};

const MAX_CELL_SIZE = 14;
const MIN_CELL_SIZE = 6;
const WEEKDAY_LABEL_WIDTH = 42;

const CELL_GAP_RATIO = 3 / 14;
const MONTH_GAP_RATIO = 10 / 14;

const layoutFor = (available: number, columns: number, monthStarts: number) => {
  const plainGaps = Math.max(0, columns - 1 - monthStarts);

  const divisor =
    columns + (CELL_GAP_RATIO * plainGaps + MONTH_GAP_RATIO * monthStarts);

  const cell =
    available > 0 && divisor > 0
      ? Math.min(
          MAX_CELL_SIZE,
          Math.max(MIN_CELL_SIZE, Math.floor(available / divisor))
        )
      : MAX_CELL_SIZE;

  return {
    cell,
    gap: Math.max(2, Math.round(cell * CELL_GAP_RATIO)),
    monthGap: Math.max(5, Math.round(cell * MONTH_GAP_RATIO)),
    labelFont: Math.max(8, Math.round(cell * 0.78)),
  };
};

export function StudyHeatmap() {
  const { data, isPending } = useHeatmap();

  const { weeks, weekMeta } = useMemo(() => {
    if (!data?.length)
      return {
        weeks: [] as (HeatmapDay | null)[][],
        weekMeta: [] as WeekMeta[],
      };

    const weeks: (HeatmapDay | null)[][] = [];

    const weekdayOf = (dateStr: string) => {
      const d = new Date(dateStr);
      return (d.getDay() + 6) % 7;
    };
    const monthKeyOf = (dateStr: string) => {
      const d = new Date(dateStr);
      return `${d.getFullYear()}-${d.getMonth()}`;
    };

    let currentWeek: (HeatmapDay | null)[] = new Array(7).fill(null);
    let currentMonthKey: string | null = null;
    let columnHasData = false;

    for (const day of data) {
      const weekday = weekdayOf(day.date);
      const monthKey = monthKeyOf(day.date);

      if (columnHasData && monthKey !== currentMonthKey) {
        weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
        columnHasData = false;
      }

      currentMonthKey = monthKey;
      currentWeek[weekday] = day;
      columnHasData = true;

      if (weekday === 6) {
        weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
        columnHasData = false;
      }
    }

    if (columnHasData) {
      weeks.push(currentWeek);
    }

    const weekMeta: WeekMeta[] = weeks.map((week, weekIndex) => {
      const firstDay = week.find((d): d is HeatmapDay => d !== null);
      if (!firstDay) return { isMonthStart: false, label: null };

      const month = new Date(firstDay.date).getMonth();

      const prevWeek = weekIndex > 0 ? weeks[weekIndex - 1] : null;
      const prevFirstDay = prevWeek
        ? prevWeek.find((d): d is HeatmapDay => d !== null)
        : null;
      const prevMonth = prevFirstDay
        ? new Date(prevFirstDay.date).getMonth()
        : null;

      if (weekIndex === 0) {
        return { isMonthStart: false, label: MONTHS[month] };
      }

      if (month !== prevMonth) {
        return { isMonthStart: true, label: MONTHS[month] };
      }

      return { isMonthStart: false, label: null };
    });

    return { weeks, weekMeta };
  }, [data]);

  const chartRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);

  useEffect(() => {
    const element = chartRef.current;

    if (!element) return;

    const measure = () =>
      setAvailableWidth(element.clientWidth - WEEKDAY_LABEL_WIDTH);

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => observer.disconnect();
  }, [weeks.length]);

  const monthStarts = weekMeta.filter((meta) => meta.isMonthStart).length;

  const layout = useMemo(
    () => layoutFor(availableWidth, weeks.length, monthStarts),
    [availableWidth, weeks.length, monthStarts]
  );

  if (isPending) {
    return <motion.div className="lp-clay-card lp-clay-white h-48 animate-pulse rounded-3xl" />;
  }

  if (!data) return null;

  const { cell, gap, monthGap, labelFont } = layout;

  const getMarginLeft = (weekIndex: number) => {
    if (weekIndex === 0) return 0;
    return weekMeta[weekIndex]?.isMonthStart ? monthGap : gap;
  };

  const monthGroups = weeks.reduce<
    { start: number; span: number; label: string }[]
  >((acc, _, weekIndex) => {
    const label = weekMeta[weekIndex]?.label;
    if (label) {
      acc.push({ start: weekIndex, span: 1, label });
    } else if (acc.length) {
      acc[acc.length - 1].span += 1;
    }
    return acc;
  }, []);

  return (
    <motion.section
      className="w-full space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">Study Activity</h2>

        <span className="text-sm text-muted-foreground">Last 365 days</span>
      </div>

      <motion.div
        className="lp-clay-card lp-clay-white rounded-3xl p-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div ref={chartRef} className="w-full">
          {/* Month labels */}
          <div
            className="flex"
            style={{
              marginLeft: WEEKDAY_LABEL_WIDTH,
              marginBottom: gap + 2,
              height: labelFont + 5,
            }}
          >
            {monthGroups.map((group) => (
              <div
                key={`month-${group.start}`}
                className="flex shrink-0 justify-center"
                style={{
                  width: group.span * cell + (group.span - 1) * gap,
                  marginLeft: getMarginLeft(group.start),
                }}
              >
                <span
                  className="text-muted-foreground whitespace-nowrap"
                  style={{ fontSize: labelFont }}
                >
                  {group.label}
                </span>
              </div>
            ))}
          </div>

          <div className="flex">
            {/* Weekday labels */}
            <div
              className="mr-2 flex w-[34px] flex-col justify-between text-muted-foreground"
              style={{ fontSize: labelFont }}
            >
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
              <span>Sun</span>
            </div>

            {/* Heatmap */}
            <div className="flex">
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="grid shrink-0"
                  style={{
                    gridTemplateRows: `repeat(7, ${cell}px)`,
                    rowGap: `${gap}px`,
                    width: cell,
                    marginLeft: getMarginLeft(weekIndex),
                  }}
                >
                  {week.map((day, dayIndex) =>
                    day ? (
                      <div
                        key={day.date}
                        title={`${new Date(
                          day.date
                        ).toDateString()}
${Math.floor(day.watchedSeconds / 60)} min studied`}
                        className={`rounded-[3px] transition-colors ${HEATMAP_COLORS[day.level]}`}
                        style={{ width: cell, height: cell }}
                      />
                    ) : (
                      <div
                        key={dayIndex}
                        style={{ width: cell, height: cell }}
                      />
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div
            className="mt-5 flex items-center justify-end gap-2 text-muted-foreground"
            style={{ fontSize: labelFont }}
          >
            <span>Less</span>

            {HEATMAP_COLORS.map((color) => (
              <div
                key={color}
                className={`rounded-sm ${color}`}
                style={{
                  width: Math.max(8, cell - 2),
                  height: Math.max(8, cell - 2),
                }}
              />
            ))}

            <span>More</span>
          </div>
        </div>
      </motion.div>
    </motion.section>
  );
}