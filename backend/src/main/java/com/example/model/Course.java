package com.example.model;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String duration;

    @JsonIgnore
    @OneToMany(mappedBy = "course", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CourseFee> courseFees;

    public Course() {}

    public Long getId()                    { return id; }
    public String getName()                { return name; }
    public String getDuration()            { return duration; }
    public List<CourseFee> getCourseFees() { return courseFees; }

    public void setId(Long id)                       { this.id = id; }
    public void setName(String name)                 { this.name = name; }
    public void setDuration(String duration)         { this.duration = duration; }
    public void setCourseFees(List<CourseFee> fees)  { this.courseFees = fees; }
}