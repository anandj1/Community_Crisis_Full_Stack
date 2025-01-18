import React from 'react';
import { format } from 'date-fns';
import { Severity, Status, severityConfig, statusConfig } from '../../types/status';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  status: Status;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

interface IssuesListProps {
  issues: Issue[];
  loading: boolean;
}

export function IssuesList({ issues, loading }: IssuesListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!issues.length) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No issues</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new issue.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow-sm rounded-lg">
      <ul role="list" className="divide-y divide-gray-200">
        {issues.map((issue) => (
          <li key={issue.id} className="hover:bg-gray-50">
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <p className="truncate text-sm font-medium text-indigo-600">{issue.title}</p>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${severityConfig[issue.severity].color}`}>
                    {severityConfig[issue.severity].label}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[issue.status].color}`}>
                    {statusConfig[issue.status].label}
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  {issue.assignedTo && (
                    <span className="mr-4">
                      Assigned to: <span className="font-medium">{issue.assignedTo}</span>
                    </span>
                  )}
                  <time dateTime={issue.createdAt}>
                    {format(new Date(issue.createdAt), 'MMM d, yyyy')}
                  </time>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-sm text-gray-500 line-clamp-2">{issue.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}