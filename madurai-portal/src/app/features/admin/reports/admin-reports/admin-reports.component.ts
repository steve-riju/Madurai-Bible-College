import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TeacherReportsService } from '../../../teacher/services/teacher-reports.service';
import { TeacherDailyReportDto } from '../../../teacher/models/teacher-report';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-admin-reports',
  templateUrl: './admin-reports.component.html',
  styleUrls: ['./admin-reports.component.scss']
})
export class AdminReportsComponent implements OnInit {
  reports: TeacherDailyReportDto[] = [];
  dataSource = new MatTableDataSource<TeacherDailyReportDto>([]);
  displayedColumns = ['teacherName','batchName','semester','date','lessonCovered','time','actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('reportDialog') reportDialog!: TemplateRef<any>;

  selectedReport?: TeacherDailyReportDto;

  filter = {
    teacherId: null as number | null,
    date: null as string | null,
    batchName: '',
    semester: ''
  };

  teacherList: { id?: number, name?: string }[] = [];

  constructor(
    private svc: TeacherReportsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadReports();
  }

  private buildTeacherList() {
    const map = new Map<number, string>();
    this.reports.forEach(r => {
      if (r.teacherId && !map.has(r.teacherId)) {
        map.set(r.teacherId, r.teacherName || `T-${r.teacherId}`);
      }
    });
    this.teacherList = Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }

  loadReports() {
    this.svc.getAllReports().subscribe({
      next: (res) => {
        this.reports = res || [];
        this.buildTeacherList();
        this.dataSource.data = this.reports;
        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
    });
  }

  applyFilters() {
    const f = this.filter;
    this.dataSource.data = this.reports.filter(r => {
      if (f.teacherId && r.teacherId !== f.teacherId) return false;
      if (f.date && (!r.date || r.date.slice(0,10) !== f.date)) return false;
      if (f.batchName && !(r.batchName || '').toLowerCase().includes((f.batchName || '').toLowerCase())) return false;
      if (f.semester && !(r.semester || '').toLowerCase().includes((f.semester || '').toLowerCase())) return false;
      return true;
    });
  }

  clearFilters() {
    this.filter = { teacherId: null, date: null, batchName: '', semester: '' };
    this.applyFilters();
  }

  viewReport(row: TeacherDailyReportDto) {
    this.selectedReport = row;
    this.dialog.open(this.reportDialog, {
      width: '500px',
      panelClass: 'report-dialog-panel'
    });
  }

  exportCsv() {
    const rows = this.dataSource.data.map(r => ({
      teacherName: r.teacherName,
      batchName: r.batchName,
      semester: r.semester,
      date: r.date,
      startTime: r.startTime,
      endTime: r.endTime,
      lessonCovered: r.lessonCovered,
      assignmentsGiven: r.assignmentsGiven,
      additionalNotes: r.additionalNotes,
      createdAt: r.createdAt
    }));
    const header = Object.keys(rows[0] || {}).join(',');
    const csv = [header].concat(rows.map(row =>
      Object.values(row).map(v => `"${(v ?? '').toString().replace(/"/g,'""')}"`).join(',')
    )).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `teacher_daily_reports_${new Date().toISOString().slice(0,10)}.csv`);
  }
}
