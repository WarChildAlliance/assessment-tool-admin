import { Component, OnInit, Input } from '@angular/core';
import { Assessment } from '../../core/models/assessment.model';
import { Topic } from '../../core/models/topic.models';
import { AssessmentService } from '../../core/services/assessment.service';

@Component({
  selector: 'app-table-row-details',
  templateUrl: './table-row-details.component.html',
  styleUrls: ['./table-row-details.component.scss']
})
export class TableRowDetailsComponent implements OnInit {

  @Input() config: 'library' | 'students';
  @Input() data: Assessment;

  public topics: Topic[];
  public topicIndex = 0;
  public questionIndex = 0;

  constructor(private assessmentService: AssessmentService) { }

  ngOnInit(): void {
    if (this.config === 'library') {
      this.data.topics.forEach(topic => {
        this.assessmentService.getTopicQuestions(
          this.data.id.toString(), topic.id.toString()).subscribe(questions => {
            topic.questions = questions;
          });
      });
      this.topics = this.data.topics;
    }
  }
}
